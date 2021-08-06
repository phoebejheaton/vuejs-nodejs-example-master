var express = require('express');
const { userInfo } = require('os');
const path = require('path');
const prompt = require('prompt-sync')({sigint: true});
const {Sequelize, Model, DataTypes, DatabaseError, QueryTypes, Op} = require('sequelize');

var app = express();

const Entries = [];

const sequelize = new Sequelize('RUG_ShopFloor', 'pheaton', 'pheaton', {
    dialect : 'mssql',
    host: '172.16.102.60',
    port: 1433,
    logging: console.log,
    dialectOptions: {
        instanceName: 'MSSQLSERVER'
    },
} );

const Code = sequelize.define('DowntimeCodes_phoebe', {
    
    DowntimeCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    DownTimeL1 : {
        type: DataTypes.STRING
    },
    DownTimeL2: {
        type: DataTypes.STRING
    },
    DownTimeL3: {
        type: DataTypes.STRING
    },
    DownTimeL4: {
        type: DataTypes.STRING
    },
    AccessLevel: {
        type: DataTypes.INTEGER
    },
    Filter: {
        type: DataTypes.STRING
    },
    Valid: {
        type: DataTypes.CHAR
    },
    Rank: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    Exclude: {
        type: DataTypes.STRING
    },
    Description: {
        type: DataTypes.STRING
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'DowntimeCodes_phoebe'
});

app.use(express.static(path.join(__dirname, '../app/dist')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../app/build/index.html'));
});

app.get('/api/entry', function (req, res) {
    const entry = req.body.entry;
    Entries.push(entry);
    res.json("added");
});

app.get('/api/database', async function (req, res) {

    try{
        const ans = await Code.findAll({
            attributes: ['DowntimeCode', 'DownTimeL3', 'DownTimeL4', 'AccessLevel', 'Filter', 'Description'],   
            where: {
                AccessLevel: {
                    [Op.gte]: 1
                },
                Valid: {
                    [Op.like]: 'Y'
                },
                [Op.or]: [{
                    Filter: 'ALL'
                },
                {
                    Filter: 'GR'
                }
            ]
                
        }, });
        res.send(ans);
    }
    catch (e) {
        console.log("caught ", e)
    }
});


app.post('/api/database/del/:DTC', async (req, res) => {
    try{
        console.log(req.params.DTC)
        var entry = await Code.findByPk(req.params.DTC)
        if(entry)
            entry = await entry.update({Valid: "N"});     
    } catch (e) { console.log("caught ", e);}
    res.json("deleted");
});

app.post('/api/database/editdesc/:DTC/:CHANGETO', async (req, res) => {
    try{
        var entry = await Code.findByPk(req.params.DTC);
        if(entry)
            entry = await entry.update({Description: req.params.CHANGETO });
    } catch (e) {}
    res.json("editted");
});

app.post('/api/database/add/:TYP/:DTL2/:DTL3/:FLTR/:EXCL/:DESC', async (req,res) => {
    try{

        var DTL1;
        if(req.params.DTL2 == "Planned Stoppage")
            DTL1 = 'GOEE';
        else if(req.params.DTL2 == "Shutdown")
            DTL1 = 'EOEE';
        else
            DTL1 = 'OEE';

        var excl;
        if(req.params.EXCL === 'start')
            excl = 'XXX'
        else{
            excl = 'H0';
        }
        
        var DTC;
        var accLvl;
        if(req.params.TYP == "T"){
            accLvl = 2;
            var largest = await Code.max('DowntimeCode', {where: {DowntimeCode: {[Op.like]: 'TC%-00'}}});
            if(largest){
                var sliced = largest.substring(2,6);
                sliced ++;
                var formattedNum = sliced.toLocaleString('en-GB', {minimumIntegerDigits: 4, useGrouping: false});
                DTC = 'TC' + formattedNum + '-00';

                largest = await Code.create({DowntimeCode: DTC, DownTimeL1: DTL1,
                    DownTimeL2: req.params.DTL2, DownTimeL3: 'Tool Change', DownTimeL4: req.params.DTL3,
                    AccessLevel: accLvl, Filter: req.params.FLTR, Valid: 'Y', Rank: 1,
                    Exclude: excl, Description: req.params.DESC});
            }
        } else {
            accLvl = 1;
            var biggest = await Code.max('DowntimeCode', {where: {DowntimeCode: {[Op.like]: 'DT%'}}});
            console.log(biggest)
            if(biggest){
                var number = biggest.slice(2);
                number++;
                console.log(number)
                var formattedNum = number.toLocaleString('en-GB', {minimumIntegerDigits: 3, useGrouping: false});
                DTC = 'DT' + formattedNum;

                biggest = await Code.create({DowntimeCode: DTC, DownTimeL1: DTL1,
                    DownTimeL2: req.params.DTL2, DownTimeL3: req.params.DTL3, DownTimeL4: req.params.DTL3,
                    AccessLevel: accLvl, Filter: req.params.FLTR, Valid: 'Y', Rank: 1,
                    Exclude: excl, Description: req.params.DESC});
            } 
        }

    }
    catch(e){console.log(e)}
    res.json("added");
});

app.post('/api/database/add/:DTC/:DTL4/:DESC', async (req, res) => {
    try{
        var entry = await Code.findByPk(req.params.DTC);
        var type;
        if(req.params.DTC.includes('DT'))
            type = 'DT';
        else    
            type = 'TC';

        
        var accLvl = (entry.AccessLevel);
        accLvl++;

        if(entry){
            var newDTC;
            if(type === 'DT'){
                var biggest = await Code.max('DowntimeCode', {where: {DowntimeCode: {[Op.like]: 'DT%'}}});
                console.log(biggest)
                if(biggest){
                    var number = biggest.slice(2);
                    number++;
                    console.log(number)
                    var formattedNum = number.toLocaleString('en-GB', {minimumIntegerDigits: 3, useGrouping: false});
                    newDTC = biggest.substring(0,2) + formattedNum;
                    console.log(newDTC)

                    entry = await Code.create({DowntimeCode: newDTC, DownTimeL1: entry.DownTimeL1,
                        DownTimeL2: entry.DownTimeL2, DownTimeL3: entry.DownTimeL3, DownTimeL4: req.params.DTL4,
                        AccessLevel: accLvl, Filter: entry.Filter, Valid: entry.Valid, Rank: entry.Rank,
                        Exclude: entry.Exclude, Description: req.params.DESC});
                }
            }
            else {
                var large = req.params.DTC.slice(0,7);
                var largest = await Code.max('DowntimeCode', {where: {DowntimeCode: {[Op.like]: large + '%'}}});
                if(largest){
                    var number = largest.slice(7);
                    number++;
                    var formattedNum = number.toLocaleString('en-GB', {minimumIntegerDigits: 2, useGrouping: false});
                    newDTC = req.params.DTC.substring(0,7) + formattedNum;

                    entry = await Code.create({DowntimeCode: newDTC, DownTimeL1: entry.DownTimeL1,
                        DownTimeL2: entry.DownTimeL2, DownTimeL3: entry.DownTimeL4, DownTimeL4: req.params.DTL4,
                        AccessLevel: accLvl, Filter: entry.Filter, Valid: entry.Valid, Rank: entry.Rank,
                        Exclude: entry.Exclude, Description: req.params.DESC});
                }
            }
            //console.log(newDTC +','+ entry.DownTimeL1+','+entry.DownTimeL2+','+entry.DownTimeL3+','+req.params.DTL4+','+entry.AccessLevel+','+entry.Filter+','+entry.Valid+','+entry.Rank+','+entry.Exclude+','+req.params.DESC);    
        }
    } catch (e) { console.log(e)}
    res.json("added");
});

var server = app.listen(3080, function () {
    console.log('Server is running on port 3000');
});
