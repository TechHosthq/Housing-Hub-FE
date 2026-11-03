import { describe, expect, it } from "vitest";
import { resolveApiError, resolveMutationError } from "./errorResolver";

/**
 * Two different shapes reach a mutation's catch, and forms were checking for the
 * second one inline — so every new form was one missed check away from replacing
 * a good server message with "Something went wrong".
 */
describe("resolveMutationError", () => {
    /**
     * A 200 carrying isSuccessful:false. The axios interceptor rejects with the
     * response itself, so the body sits at error.data with no wrapper.
     */
    it("reads a rejected 200, whose body has no response wrapper", () => {
        const rejected = { data: { isSuccessful: false, message: "This link has expired." } };

        expect(resolveMutationError(rejected)).toEqual(["This link has expired."]);
    });

    /** A real transport failure, where axios throws and the body is nested. */
    it("reads a thrown HTTP error, whose body is nested under response", () => {
        const thrown = { response: { data: { message: "That account isn't in your name." } } };

        expect(resolveMutationError(thrown)).toEqual(["That account isn't in your name."]);
    });

    /**
     * Never axios's own text. "Request failed with status code 400" is the HTTP
     * library talking, and it is not fit to show anybody.
     */
    it.each([null, undefined, new Error("Network Error"), {}])(
        "falls back to something true for %o",
        (failure) => {
            const [message] = resolveMutationError(failure);

            expect(message).toBe("Something went wrong. Please try again.");
            expect(message).not.toContain("status code");
        },
    );
});

describe("resolveApiError", () => {
    it("prefers the envelope's own sentence over a field breakdown", () => {
        const error = {
            response: { data: { message: "Pick a bank.", errors: { BankCode: ["required"] } } },
        };

        expect(resolveApiError(error)).toEqual(["Pick a bank."]);
    });

    /**
     * ProblemDetails keys are C# property names and are never shown; the values
     * already read as sentences.
     */
    it("flattens a field-keyed object without showing the keys", () => {
        const error = {
            response: { data: { errors: { PhoneNumber: ["The PhoneNumber field is required."] } } },
        };

        expect(resolveApiError(error)).toEqual(["The PhoneNumber field is required."]);
    });

    /** "One or more validation errors occurred" is true and useless. */
    it("ignores ProblemDetails' title", () => {
        const error = { response: { data: { title: "One or more validation errors occurred." } } };

        expect(resolveApiError(error)).toEqual(["Something went wrong. Please try again."]);
    });
});
