const router = require('express').Router();

router.get('/businessLegality1', (req,res)=>{
  res.render('businessLegality/businessLegality1')
})
router.get('/businessLegality2', (req,res)=>{
  res.render('businessLegality/businessLegality2')
})
router.get('/businessLegality3', (req,res)=>{
  res.render('businessLegality/businessLegality3')
})
router.get('/businessLegality4', (req,res)=>{
  res.render('businessLegality/businessLegality4')
})
router.get('/businessLegality5', (req,res)=>{
  res.render('businessLegality/businessLegality5')
})

module.exports = router