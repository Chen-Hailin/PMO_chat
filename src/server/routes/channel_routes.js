var Channel = require('../models/Channel');
var bodyparser = require('body-parser');

module.exports = function (router) {
    router.use(bodyparser.json());

    // deprecating this route since it just gets all channels
    router.get('/channels', function (req, res) {

        Channel.find({}, null, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }

            res.json(data);
        });
    });

    // this route returns all channels including private channels for that user
    //   {name: 1, id:1, private: 1, between: 1, _id:0, caseDescription: 1, caseLocation: 1, efForce: 1, approved: 1}
    router.get('/channels/:name', function (req, res) {
        Channel.find({$or: [{between: req.params.name}, {private: false}]}, null, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }
            res.json(data);
        });
    });

    router.get('/channels/retrieve/:name', function(req, res) {
       Channel.findOne({name: req.params.name}, null, function (err, data) {
           if (err) {
               console.log(err);
               return res.status(500).json({msg: 'internal server error'});
           }
           res.json(data);
       });
    });

    // post a new user to channel list db
    router.post('/channels/new_channel', function (req, res) {
        var newChannel = new Channel(req.body);
        newChannel.save(function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }
            res.json(data);
        });
    });

    router.post('/channels/approve', function (req, res) {
        var curChannel = new Channel(req.body);
        Channel.update({ name: curChannel.name }, { $set: { approved: true }}).exec();
        res.json(curChannel);
    });

    router.post('/channels/withdraw', function (req, res) {
        var curChannel = new Channel(req.body);
        Channel.update({ name: curChannel.name }, { $set: { approved: false }}).exec();
        res.json(curChannel);
    });

    router.post('/channels/update', function(req, res) {
        var curChannel = new Channel(req.body);
        Channel.findOne({ name: curChannel.name }, function (err, doc){
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }
            doc.caseDescription = curChannel.caseDescription;
            doc.caseLocation = curChannel.caseLocation;
            doc.efForce = curChannel.efForce;
            doc.approved = false;
            doc.save();
            res.json(doc);
        });
    });
}
