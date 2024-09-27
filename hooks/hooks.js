export const handleSaveError = (error, data, next) => {
    const {name, code} = error;
    error.status = name ==="MongoServerError" && code === 1100 ? 400 : 400;
    next()
}

export const preUpdate = function(next){
    this.options.new = true;
    this.options.runValidator = true;
    next()
}