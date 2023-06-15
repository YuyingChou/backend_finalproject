const router = require('express').Router();
const Pin = require('../models/Pin');
//create a pin
router.post('/',async(req,res)=>{
    const newPin = new Pin(req.body);
    try{
        const savePin = await newPin.save();
        res.status(200).json(savePin)
    }catch(err){
        res.status(400).json(err);
    }
});

//get all pins
router.get('/',async(req,res)=>{
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (err) {
        res.status(400).json(err);
    }
});

//delete a pin
router.delete('/:id', async (req, res) => {
    try {
      const deletedPin = await Pin.findByIdAndDelete(req.params.id);
      if (!deletedPin) {
        res.status(404).json({ message: 'Pin不存在' });
        return;
      }
      res.status(200).json({ message: 'Pin已被刪除' });
    } catch (err) {
      res.status(400).json(err);
    }
  });

module.exports = router;