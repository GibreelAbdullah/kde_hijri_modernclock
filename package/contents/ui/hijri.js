// Hijri Date Converter for QML
// Based on Umm al-Qura calendar algorithm


/**
 * The Julian Day number for the start of the Islamic calendar (1 Muharram 1 AH).
 * @type {number}
 */
var ISLAMIC_EPOCH = 1948439.5;

/**
 * The Julian Day number for the start of the Gregorian calendar.
 * @type {number}
 */
var GREGORIAN_EPOCH = 1721425.5;

// Hijri month names
/**
 * English names for Hijri months.
 * @type {string[]}
 */
var monthNames = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

/**
 * Arabic names for Hijri months.
 * @type {string[]}
 */
var monthNamesAr = [
    "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
    "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان",
    "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

/**
 * Correct modulo operation for negative numbers.
 * @param {number} a - Dividend.
 * @param {number} b - Divisor.
 * @returns {number} a % b.
 */
function mod(a, b) {
    return a - (b * Math.floor(a / b));
}

/**
 * Converts a Gregorian date to a Julian Day number.
 * @param {number} year - Gregorian year.
 * @param {number} month - Gregorian month (1-12).
 * @param {number} day - Gregorian day.
 * @returns {number} The Julian Day number.
 */
function gregorianToJulianDay(year, month, day) {
    var a = Math.floor((14 - month) / 12);
    var y = year + 4800 - a;
    var m = month + (12 * a) - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 
           (365 * y) + Math.floor(y / 4) - 
           Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Converts Western Arabic numerals (0-9) to Eastern Arabic-Indic numerals (٠-٩).
 * @param {string} str - String containing digits to convert.
 * @returns {string} String with Eastern Arabic-Indic numerals.
 */
function toArabicIndic(str) {
  const arabicIndic = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return str.replace(/\d/g, d => arabicIndic[d]);
}


/**
 * Converts a Julian Day number to a Hijri date object.
 * @param {number} jd - The Julian Day number.
 * @returns {{year: number, month: number, day: number}} An object containing Hijri year, month, and day.
 */
function julianDayToHijri(jd) {
    jd = Math.floor(jd) + 0.5;
    
    var year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
    var month = Math.min(12, Math.ceil((jd - (29 + islamicToJulianDay(year, 1, 1))) / 29.5) + 1);
    var day = (jd - islamicToJulianDay(year, month, 1)) + 1;
    
    return {
        year: year,
        month: month,
        day: day
    };
}

/**
 * Converts a Hijri date to a Julian Day number.
 * @param {number} year - Hijri year.
 * @param {number} month - Hijri month (1-12).
 * @param {number} day - Hijri day.
 * @returns {number} The Julian Day number.
 */
function islamicToJulianDay(year, month, day) {
    return (day + 
            Math.ceil(29.5 * (month - 1)) + 
            (year - 1) * 354 + 
            Math.floor((3 + (11 * year)) / 30) + 
            ISLAMIC_EPOCH) - 1;
}


/**
 * Converts a JavaScript Date object (Gregorian) to a Hijri date object.
 * @param {Date} date - JavaScript Date object.
 * @param {number} [offset=0] - Manual adjustment in days.
 * @returns {{year: number, month: number, day: number}} An object containing Hijri year, month, and day.
 */
function gregorianToHijri(date, offset) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    var jd = gregorianToJulianDay(year, month, day) + (offset || 0);
    return julianDayToHijri(jd);
}

/**
 * Gets a Hijri date with localized month names and numerals.
 * @param {Date} [date=new Date()] - Optional JavaScript Date object.
 * @param {boolean} [useArabic=false] - Whether to use Arabic month names and Indic numerals.
 * @param {number} [offset=0] - Manual adjustment in days.
 * @returns {{day: string|number, month: number, monthName: string, year: string|number, formatted: string}}
 */
function getHijriDate(date, useArabic, offset) {
    if (!date) date = new Date();
    
    var hijri = gregorianToHijri(date, offset);
    var names = useArabic ? monthNamesAr : monthNames;
    
    var displayDay = useArabic ? toArabicIndic(hijri.day.toString()) : hijri.day
    var displayYear= useArabic ? toArabicIndic(hijri.year.toString()) : hijri.year

    return {
        day: displayDay,
        month: hijri.month,
        monthName: names[hijri.month - 1],
        year: displayYear,
        formatted: displayDay + " " + names[hijri.month - 1] + " " + displayYear
    };
}

/**
 * Gets a Hijri date as a formatted string.
 * @param {Date} date - JavaScript Date object.
 * @param {boolean} useArabic - Whether to use Arabic month names and Indic numerals.
 * @param {number} [offset=0] - Manual adjustment in days.
 * @returns {string} Formatted Hijri date string.
 */
function getHijriDateString(date, useArabic, offset) {
    return getHijriDate(date, useArabic, offset).formatted;
}