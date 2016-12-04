module.exports = {
    roundUp: function(num, precision) {
        return Math.ceil(num * precision) / precision
    }
}