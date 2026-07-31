/**
 * Converts a 12-hour time string (e.g., "10:00 AM", "12:00 PM") to a 24-hour time string (e.g., "10:00:00", "12:00:00").
 */
export const formatTimeTo24h = (time: string): string => {
    if (!time) return "12:00:00";
    
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    let h = parseInt(hours);
    
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    
    return `${String(h).padStart(2, "0")}:${minutes}:00`;
};

/**
 * Ensures a date is in YYYY-MM-DD format.
 */
export const formatDateToYMD = (date: string | Date): string => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Today's date as a YYYY-MM-DD string in the browser's local timezone.
 * Deliberately avoids Date#toISOString(), which converts to UTC and can
 * shift the calendar date in timezones ahead of UTC (e.g. Nigeria, UTC+1).
 */
export const todayLocalISODate = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Parses a YYYY-MM-DD string into its numeric parts, or null if malformed.
 * Deliberately avoids `new Date(isoString)`, which parses date-only ISO
 * strings as UTC midnight and can display as the previous day locally.
 */
export const parseISODate = (value: string): { year: number; month: number; day: number } | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const d = new Date(year, month, day);
    if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
    return { year, month, day };
};

/**
 * Converts a 24-hour time string ("HH:mm" or "HH:mm:ss") to 12-hour
 * display format ("h:mm AM/PM"). Returns the input unchanged if it doesn't
 * look like a 24-hour time string.
 */
export const formatTimeTo12h = (time: string | null | undefined): string => {
    if (!time) return "";
    const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time);
    if (!match) return time;

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
};

/**
 * Parses either a 12-hour ("h:mm AM/PM") or 24-hour ("HH:mm[:ss]") time
 * string into TimePicker's internal { hour, minute, period } shape.
 */
export const parseTimeValue = (value: string | null | undefined): { hour: string; minute: string; period: "AM" | "PM" } | null => {
    if (!value) return null;

    const twelveHour = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
    if (twelveHour) {
        return {
            hour: twelveHour[1].padStart(2, "0"),
            minute: twelveHour[2],
            period: twelveHour[3].toUpperCase() as "AM" | "PM"
        };
    }

    const twentyFourHour = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(value.trim());
    if (twentyFourHour) {
        let hours = parseInt(twentyFourHour[1], 10);
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return { hour: String(hours).padStart(2, "0"), minute: twentyFourHour[2], period };
    }

    return null;
};
