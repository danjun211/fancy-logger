import dayjs from 'dayjs';

class FancyDate {
    static now() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
    }
}

export default FancyDate;
