import moment from  'moment';

export const timeLineDateFormatter = (date: Date) => {
    return moment(date).format('MMM Do YYYY, h:mm:ss a')
}