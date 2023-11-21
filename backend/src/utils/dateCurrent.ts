export default class DateCurrent {
  static year: number | string;
  static month: number | string;
  static date: number | string;

  static getDateCurrentShort(): string {
    const currentDate = new Date();
    this.date = currentDate.getDate();
    this.date = this.date < 10 ? `0${this.date}` : this.date.toString();
    this.month = currentDate.getMonth() + 1;
    this.month = this.month < 10 ? `0${this.month}` : this.month.toString();
    this.year = currentDate.getFullYear();
    const shortDate = this.year.toString().substr(2) + this.month + this.date;
    return shortDate;
  }

  static getTimeCurrent(): string {
    const myDate = new Date()
      .toTimeString()
      .replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return myDate;
  }
}
