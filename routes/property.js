var express = require('express');
var router = express.Router();
var pool = require("./pool")
var upload = require("./multer");
var {LocalStorage}=require('node-localstorage')
var localstorage=new LocalStorage('./scratch')


/* GET home page. */
router.get('/property_interface', function (req, res, next) {
  try{
    var data=JSON.parse(localstorage.getItem("ADMIN"))
    if(data)
      res.render('propertyinterface',{message:'',data:{}});
    else
      res.render('loginpage',{message:''})
  }
  catch(e)
  {
    res.render('loginpage',{message:''})
  }
});

router.get('/fetch_all_states',function(req,res){
  pool.query("select * from states",function(error,result){

    if(error)
    {
      res.json({data:[],message:'Error in Query pls contact to DBA'})
    }
    else
    {
       res.json({data:result,message:'Successfull'})
    }
  })

})

router.get('/fetch_all_cities',function(req,res){
  pool.query("select * from cities where stateid=? ",[req.query.stateid],function(error,result){

    if(error)
    {
      res.json({data:[],message:'Error in Query pls contact to DBA'})
    }
    else
    {
  
       res.json({data:result,message:'Successfull'})
    }
  })

})

router.get('/fetch_all_places',function(req,res){
  pool.query("select * from places where cityid=? ",[req.query.cityid],function(error,result){

    if(error)
    {
      res.json({data:[],message:'Error in Query pls contact to DBA'})
    }
    else
    {
       res.json({data:result,message:'Successfull'})
    }
  })

})

router.post('/submit_property',upload.single('picture'),function(req,res){
  console.log(req.body);
  console.log(req.file);

  pool.query("insert into property(stateid, cityid, placeid, ownername, mobileno, emailid, area, price, type, status, picture) value(?,?,?,?,?,?,?,?,?,?,?)",[req.body.stateid, req.body.cityid, req.body.placeid, req.body.ownername, req.body.mobile, req.body.email, req.body.area, req.body.price, req.body.type, req.body.status, req.file.filename],function(error,result){
   if(error)
   {
    res.render('propertyinterface',{message:'error in query...'})
   }
   else
   {
    res.render('propertyinterface',{message:'Property Added Successfully...'})
   }
  })
})

router.get('/display_all', function(req, res) {
  try{
    var data=JSON.parse(localstorage.getItem("ADMIN"))

    if(data)
      {
      pool.query("select property.*, states.*, cities.*, places.* from property, states, cities, places where property.stateid=states.stateid and property.cityid=cities.cityid and property.placeid=places.placeid",function(error, result) {
      if(error) 
      {
        res.render('displayall', {data: [], message: 'error in query'});
      }
      else 
      {
        res.render('displayall', {data: result, message: 'Successful'});
      }
    });
  }
    else
    {
      res.render('loginpage',{message:''})
    }
  }
  catch(e)
  {
    res.render('loginpage',{message:''})
  }
});

router.get('/edit_delete', function(req, res) {
  pool.query("select property.*, states.*, cities.*, places.* from property, states, cities, places where property.stateid=states.stateid and property.cityid=cities.cityid and property.placeid=places.placeid and property.propertyid=?",[req.query.propertyid],function(error, result) {
      if(error) {
        res.render('editdelete', {data: [], message: 'error in query'});
      }
      else 
      {
        if(result.length==1)
        res.render('editdelete', {data: result[0], message: 'Successful'});
      else
       res.render('search',{data:[],message:'property Id does not exist...'})


      }
    });
});

router.post('/final_edit_delete',function(req,res){
  if(req.body.btn=="Edit")
  {
  pool.query("update property set stateid=?, cityid=?, placeid=?, ownername=?, mobileno=?, emailid=?, area=?, price=?, type=?, status=? where propertyid=?",[req.body.stateid, req.body.cityid, req.body.placeid, req.body.ownername, req.body.mobileno, req.body.emailid, req.body.area, req.body.price, req.body.type, req.body.status,req.body.propertyid],function(error,result){
   if(error)
   {
    console.log(error)
    res.redirect('/property/display_all')
   }
   else
   {
      res.redirect('/property/display_all')
   }
  })
}
else
{
   pool.query("delete from property where propertyid=?",[req.body.propertyid],function(error,result){
   if(error)
   {
    console.log(error)
    res.redirect('/property/display_all')
   }
   else
   {
      res.redirect('/property/display_all')
   }
  })
}
})

router.get("/show_picture",function(req,res){
  res.render('showpicture',{data:req.query})
})

router.post('/edit_picture', upload.single('picture'),function(req,res){
  console.log(req.body)
  console.log(req.file)
  pool.query("Update property set picture=? where propertyid=?",[req.file.filename,req.body.propertyid],function(error,result){
      if(error)
        {
          console.log(error)
        res.redirect('/property/display_all')
      }else{
        res.redirect('/property/display_all');
      }
    });
});

router.get("/search_propertyid",function(req,res){
  res.render('search',{message:''})
})
module.exports = router;