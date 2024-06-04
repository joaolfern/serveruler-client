const COMPANY_DAYS = [0, 1, 3, 5, 6];

export function getIsCompanyDay() {
  const weekDay = new Date().getDay();
  const isCompanyDay = COMPANY_DAYS.includes(weekDay);

  return isCompanyDay;
}
