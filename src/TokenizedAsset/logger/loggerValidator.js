export default class LoggerValidator {
    validateNumberParam(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (typeof (arr[i]) != 'number' && typeof (arr[i] != 'double')) {
                console.log("This param index threw the error", i, "With this value", arr[i]);
                return false;
            }
        }
        return true;
    }
}