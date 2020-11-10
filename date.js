module.exports.getDate = function() {
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };
    const today = new Date();
    return today.toLocaleDateString("en-US", options); // 9/17/2016

}
module.exports.getDay = function() {
        const options = {
            weekday: "long",
        };
        const today = new Date();
        return today.toLocaleDateString("en-US", options); // 9/17/2016

    }
    // console.log(module.exports)