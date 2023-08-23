const obj = {}
obj.randomNumber = () => {

    return parseInt(Math.random() * (999999 - 100000) + 100000);

}

module.exports = obj;