const NewsLetterJanifer = require("../models/NewsLetterJanifer");

exports.subscribe = (req,res)=>{
    if ((!req.body.fullName) || (!req.body.email)) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    //create newsletter
    const newsLetterJanifer = new NewsLetterJanifer({
        fullName: req.body.fullName,
        email: req.body.email
    });
    newsLetterJanifer.save(newsLetterJanifer).then(data =>{
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:err.message || "some error occurred while creating the newsletter"
        })
    })
}
