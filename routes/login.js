var express = require('express');
var router = express.Router();
var pool = require("./pool")
var {LocalStorage}=require('node-localstorage')
var localstorage=new LocalStorage('./scratch')


router.get('/login_page', function (req, res, next) {
  try{
    var data=JSON.parse(localstorage.getItem('ADMIN'))
  if(data)
  {
    res.render('dashboard', {data:data});
  }
  else
  {
  res.render('loginpage', { message: '' });
  }
}
catch(e)
{
  res.render('loginpage',{message:''})
}
});

router.post('/check_admin_login',function(req,res){
  console.log("=== LOGIN ===");                       // 👈 1
  console.log("BODY:", req.body);     
  pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
    console.log("ERROR:", error);                     // 👈 3
    console.log("RESULT:", result); 
    if(error)
    {
      res.render('loginpage',{message:'Server Error...'})
    }
    else
    {
      if(result.length==1)
    {
      localstorage.setItem("ADMIN",JSON.stringify(result[0]))
      res.render('dashboard',{data:result[0]})
    }
    else
    {
      res.render('loginpage',{message:'Invalid AdminId/Password'})
    }
  }
  })
})

router.get('/profile', function(req, res) {
    var data = JSON.parse(localstorage.getItem('ADMIN'));

    if (data) {
        res.render('profile', { data: data });
    } else {
        res.redirect('/login/login_page');
    }
})


router.get("/logout",function(req,res){
  localstorage.clear()
  res.redirect('/login/login_page')
})

module.exports = router;
