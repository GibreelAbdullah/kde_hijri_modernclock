// Hijri Date Converter for QML
// Based on Umm al-Qura calendar algorithm


var ISLAMIC_EPOCH = 1948439.5;
var GREGORIAN_EPOCH = 1721425.5;

// Hijri month names
var monthNames = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

var monthNamesAr = [
    "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
    "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان",
    "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

function mod(a, b) {
    return a - (b * Math.floor(a / b));
}

function gregorianToJulianDay(year, month, day) {
    var a = Math.floor((14 - month) / 12);
    var y = year + 4800 - a;
    var m = month + (12 * a) - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 
           (365 * y) + Math.floor(y / 4) - 
           Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function toArabicIndic(str) {
  const arabicIndic = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return str.replace(/\d/g, d => arabicIndic[d]);
}


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

function islamicToJulianDay(year, month, day) {
    return (day + 
            Math.ceil(29.5 * (month - 1)) + 
            (year - 1) * 354 + 
            Math.floor((3 + (11 * year)) / 30) + 
            ISLAMIC_EPOCH) - 1;
}


function gregorianToHijri(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    var jd = gregorianToJulianDay(year, month, day);
    return julianDayToHijri(jd);
}

function getHijriDate(date, useArabic) {
    if (!date) date = new Date();
    
    var hijri = gregorianToHijri(date);
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

function getHijriDateString(date, useArabic) {
    return getHijriDate(date, useArabic).formatted;
}