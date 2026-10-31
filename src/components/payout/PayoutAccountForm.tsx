"use client";

import { useState } from "react";
import { BadgeCheck, CircleAlert, Loader2, Search } from "lucide-react";
import { usePayout } from "@/hooks/usePayout";
import { useToastStore } from "@/store/useToastStore";
import { resolveMutationError } from "@/utils/errorResolver";

/**
 * Where an owner's rent is paid out to.
 *
 * Two steps on purpose. The owner checks the account first and sees the name the
 * bank holds it in; only then do they save it. The commonest cause of a refusal is
 * a mistyped digit, and finding that out as "that account isn't in your name" is
 * worse than seeing somebody else's name and correcting it.
 */
export default function PayoutAccountForm() {
    const { showSuccess } = useToastStore();
    const {
        useBanks, useMyPayoutAccount,
        resolveAccount, isResolving,
        savePayoutAccount, isSaving,
    } = usePayout();

    const { data: banksResponse } = useBanks();
    const { data: accountResponse, isLoading } = useMyPayoutAccount();

    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [resolved, setResolved] = useState<{ accountName: string; matches: boolean } | null>(null);
    const [error, setError] = useState("");

    const banks = banksResponse?.data ?? [];
    const existing = accountResponse?.data;

    const reset = () => { setResolved(null); setError(""); };

    const check = async () => {
        reset();

        try {
            const result = await resolveAccount({ bankCode, accountNumber });

            if (result.isSuccessful && result.data) {
                setResolved({
                    accountName: result.data.accountName,
                    matches: result.data.matchesYourIdentity,
                });
                return;
            }

            setError(result.message || "We couldn't check that account. Please try again.");
        } catch (failure) {
            setError(resolveMutationError(failure).join(" "));
        }
    };

    const save = async () => {
        setError("");

        try {
            const result = await savePayoutAccount({ bankCode, accountNumber });

            if (result.isSuccessful) {
                showSuccess(result.message || "Saved.");
                setAccountNumber("");
                setResolved(null);
                return;
            }

            setError(result.message || "We couldn't save that account. Please try again.");
        } catch (failure) {
            setError(resolveMutationError(failure).join(" "));
        }
    };

    const canCheck = bankCode !== "" && accountNumber.trim().length >= 10;

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-20 dark:border-gray-800 dark:bg-gray-900">
                <Loader2 className="animate-spin text-[#0095FF]" size={26} />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6">
            {existing && (
                <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/60 p-7 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <p className="flex items-center gap-2 text-[13px] font-black text-emerald-900 dark:text-emerald-300">
                        <BadgeCheck size={16} />
                        Rent is paid into this account
                    </p>
                    <p className="mt-2 text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">
                        {existing.resolvedAccountName}
                    </p>
                    <p className="mt-0.5 text-[12px] text-emerald-800/80 dark:text-emerald-200/70">
                        {existing.bankName} · {existing.accountNumberMasked}
                    </p>
                </div>
            )}

            <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100">
                    {existing ? "Change the account" : "Where should we pay you?"}
                </h2>
                {/*
                    Said before they type, not after a refusal. The check is the
                    reason this screen exists, and knowing about it up front turns a
                    rejection into something they expected.
                */}
                <p className="mt-1 text-[12px] leading-relaxed text-gray-400 dark:text-gray-500">
                    It has to be an account in your own name — we check with the bank. Rent
                    goes straight from your tenant to here; we never hold it.
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Bank
                        </label>
                        <select
                            value={bankCode}
                            onChange={(e) => { setBankCode(e.target.value); reset(); }}
                            className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900"
                        >
                            <option value="">Choose your bank</option>
                            {banks.map((bank) => (
                                <option key={bank.code} value={bank.code}>{bank.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Account number
                        </label>
                        <input
                            value={accountNumber}
                            onChange={(e) => {
                                // Digits only: a NUBAN is ten of them, and a stray
                                // space is a failed lookup the owner cannot see.
                                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                                reset();
                            }}
                            inputMode="numeric"
                            placeholder="0123456789"
                            className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 font-mono text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                        />
                    </div>

                    {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </p>
                    )}

                    {resolved && (
                        <div
                            className={`rounded-xl px-4 py-3 ${resolved.matches
                                ? "bg-emerald-50 dark:bg-emerald-950/30"
                                : "bg-amber-50 dark:bg-amber-950/30"}`}
                        >
                            <p className={`flex items-center gap-2 text-[13px] font-bold ${resolved.matches
                                ? "text-emerald-800 dark:text-emerald-300"
                                : "text-amber-800 dark:text-amber-300"}`}
                            >
                                {resolved.matches ? <BadgeCheck size={15} /> : <CircleAlert size={15} />}
                                {resolved.accountName}
                            </p>
                            <p className={`mt-1 text-[11px] leading-relaxed ${resolved.matches
                                ? "text-emerald-800/80 dark:text-emerald-200/70"
                                : "text-amber-800/80 dark:text-amber-200/70"}`}
                            >
                                {resolved.matches
                                    ? "That's you. Save it and rent will be paid in here."
                                    : "That isn't the name we have for you, so we can't pay rent into it. Check the number, or use an account in your own name."}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={check}
                            disabled={!canCheck || isResolving}
                            className="flex items-center gap-2 rounded-full border-[2px] border-[#0B2545] px-6 py-3 text-[13px] font-bold text-[#0B2545] transition-colors hover:bg-[#0B2545] hover:text-white disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                        >
                            {isResolving ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                            Check account
                        </button>

                        {/*
                            Only offered once the bank has confirmed the name is
                            theirs. The server refuses anything else regardless —
                            this just stops the owner finding out the hard way.
                        */}
                        {resolved?.matches && (
                            <button
                                type="button"
                                onClick={save}
                                disabled={isSaving}
                                className="flex items-center gap-2 rounded-full bg-primary-dark px-6 py-3 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                            >
                                {isSaving && <Loader2 size={14} className="animate-spin" />}
                                Save this account
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
