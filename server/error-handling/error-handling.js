function errorHandler(err,req,res,next) {
    console.log("Error",req.method,req.path,err);
    if(!res.headerSent){
        res
        .status(500)
        .json({message:"Internal server error.Check server console."})
    }
};

function notFoundHandler (req,res,next){
    res
    .status(404)
    .json({message:"This route does not exist"});
};

module.exports = {errorHandler,notFoundHandler}