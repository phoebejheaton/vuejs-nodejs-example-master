var express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");
const {Sequelize, Model, DataTypes, Op} = require('sequelize');
const fs = require('fs');

var app = express();

//bool to log user status
var loggedOn = false;

//Strings to hold chosen department and work centre. must == to database terms as quoted in query
var chosenDep = '';
var chosenWC = 'Z';

//hashed 
const password = '1414469398';

//email object configuration
async function email(emailContent) {
    try{

        var toSend = fs.readFileSync('./EmailList.txt', 'utf-8');
        //let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.open.liae.lisi",
            port: 25,
            secure: false
        });

        let info = await transporter.sendMail({
            from: '"Downtime Codes Update Email <DTCUpdateAddress@lisi-group.com>"',
            to: toSend,
            subject: "AUTOMATED EMAIL: Update to DowntimeCodes",
            text: emailContent
        });

        console.log("message sent! %s", info.messageID)
    } catch(e) {
        console.log(e);
    }
    
}


const sequelize = new Sequelize('RUG_ShopFloor', 'pheaton', 'pheaton', {
    dialect : 'mssql',
    host: '172.16.102.60',
    port: 1433,
    logging: console.log,
    dialectOptions: {
        instanceName: 'MSSQLSERVER'
    },
} );

const BackUp = sequelize.define('DowntimeCodesBackup', {
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
    tableName: 'DowntimeCodesBackup'
});

const Code = sequelize.define('DowntimeCodes_rev2', {
    
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
    tableName: 'DowntimeCodes_rev2'
});

const Centres = sequelize.define('WorkCentresForDTCProgram', {
    ID: {
        type: DataTypes.STRING
    },
    WCCode: {
        type: DataTypes.STRING
    },
    Department: {
        type: DataTypes.STRING
    },
    Description: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'WorkCentresForDTCProgram'
});

async function backUpRequest(){
    try{
        const trunc = await sequelize.query("truncate table DowntimeCodesBackup;", {
            model: BackUp
        });
        if(trunc) {
            const back = await sequelize.query("insert into DowntimeCodesBackup select * from DowntimeCodes_rev2;", {
                model: BackUp
            });
        }
    } catch(e){console.log("caught ", e)}
};


app.get('/api/department', async function(req,res){
    try{
        const ans = await Centres.findAll({attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('Department')), 'Department'],
        ]});
        res.send(ans);
    } catch(e){ console.log("caught ", e)}
});

/*
function find(item){
    const badStrings = ["RUGPLANNER", "QUALITY", "PLATE", "MRIHOUGHT", "MRSHALL", "MRTCAVE", "MRDROCHE", "HIGH_VOL_1",
                        "HIGH_VOL_2", "BUFFER"];
    var present = false;
    badStrings.forEach(word => {
        if(!present){
            present = (item.indexOf(word) > -1);
        }
    });
    return !present;
}
*/ 
app.post('/api/chosendepartment/:INDEX', async function (req,res){
    chosenDep = req.params.INDEX;
    res.json("chosen department!!!!");
});

app.post("/api/chosenwc/:INDEX", async function (req,res){
    chosenWC = req.params.INDEX;
    res.json("chosen work centre!!!!");
});

app.get('/api/getWC', async function(req,res){
    try{
        var qString = "SELECT WCCode, Description  FROM [WorkCentresForDTCProgram] where Department like '" + chosenDep + "%'"
        const ans = await sequelize.query(qString, {
            model: Centres,
        });
        res.send(ans);
    } catch(e){console.log("caught ", e)}
});

//************OLD FUNCTIONS USED TO DYNAMICALLY FILL DEPARTMENTS/WORK CENTRES/MACHINES FROM vWCDEFINITIONS************ */
// app.post('/api/selectedprocess/:WC', async function(req,res){
//     var wcString = req.params.WC.substring(6);
//     tempWC = wcString;
//     res.json("caught!!!!");
// });
/*
app.get('/api/getexcludes', async function(req,res){
    try{
        var qString = "SELECT DISTINCT SUBSTRING(PPPLGR,1,2) AS PPPLGR FROM [vWCDefinitions] where PPWCRE like '" + chosenDep + "%' and PPPLGR like '%"+ tempWC +"%'"
        const ans = await sequelize.query(qString, {
            model: Centres,
        });

        if(ans){
            var wantedMachines = [];
            ans.forEach(wc => {
                wantedMachines.push("'"+ wc.PPPLGR + "%" + tempWC+"%'");
            });
            qString = "SELECT DISTINCT Machine FROM [WorkCentreAllocation] where ";
            wantedMachines.forEach(words => {
                if(wantedMachines[wantedMachines.length -1] === words)
                    qString = qString + "WorkCentre like " + words;
                else
                    qString = qString + "WorkCentre like " + words + " or "
            });
            const ret = await sequelize.query(qString, {
                model: Centres
            });
            res.send(ret);
        }
    } catch (e) { console.log("caught ", e)}
});
*/

app.use(express.static(path.join(__dirname, '../my-app/dist')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

app.get('/api/user', function (req, res) {
    if(loggedOn)
        res.json("true");
    else
        res.json("false");
});

app.post('/api/logon/:PASS', function (req,res) {
    if(req.params.PASS === password){
        loggedOn = true;
        backUpRequest();
        res.json("true");
    } else{
        loggedOn = false;
        res.json("false");
    }
});

app.get('/api/database', async function (req, res) {
    console.log(chosenWC);
    try{
        const ans = await Code.findAll({
            attributes: ['DowntimeCode', 'DownTimeL3', 'DownTimeL4', 'AccessLevel', 'Filter', 'Exclude', 'Rank', 'Description'],   
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
                    Filter: chosenWC
                },
                ],
                Exclude: {
                    [Op.notLike]: '%'+chosenWC+'%'
                }
                
        }, });
        res.send(ans);
    }
    catch (e) {
        console.log("caught ", e)
    }
});


app.post('/api/database/del/:DTC/:EMAIL', async (req, res) => {
    try{
        console.log(req.params.DTC)
        var emailStr;
        var entry = await Code.findByPk(req.params.DTC)
        if(entry){
            emailStr = "DELETED CODE: " +   entry.DownTimeL4 + " in " + entry.DownTimeL3 + " with code, " + 
                        entry.DowntimeCode + ".\n Please contact Process Development if this cannot be rectified."
            entry = await entry.update({Valid: "N"}); 
            if(req.params.EMAIL === "true"){
                email(emailStr);
            }
        }    
    } catch (e) { console.log("caught ", e);}
    res.json("deleted");
});

app.post('/api/database/editdesc/:DTC/:CHANGETO/:EMAIL', async (req, res) => {
    try{
        var emailStr;
        var entry = await Code.findByPk(req.params.DTC);
        if(entry){
            emailStr = "EDITTED CODE DESCRIPTION: " +   entry.DownTimeL4 + " in " + entry.DownTimeL3 + " with code, " + 
                        entry.DowntimeCode + ". \n Description has changed from: " + entry.Description + ", to: " + req.params.CHANGETO + 
                        ".\n Please contact Process Development if this cannot be rectified."
            entry = await entry.update({Description: req.params.CHANGETO });
            if(req.params.EMAIL === "true"){
                email(emailStr);
            }
        }
    } catch (e) {}
    res.json("editted");
});

app.post('/api/database/add/:TYP/:DTL2/:DTL3/:FLTR/:EXCL/:DESC/:EMAIL/:RANK', async (req,res) => {
    try{
        var emailStr;
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
            excl = req.params.EXCL.substring(6);
        }

        var filters = req.params.FLTR.split(',');
        console.log(filters);
        filters.splice(0,1);

        var DTCs = [];
        
        var accLvl;
        if(req.params.TYP == "T"){
            accLvl = 2;
            var largest = await Code.max('DowntimeCode', {where: {DowntimeCode: {[Op.like]: 'TC%-00'}}});
            if(largest){
                var sliced = largest.substring(2,6);
                sliced ++;
                for(var i = 0; i < filters.length; i++){
                    var formattedNum = sliced.toLocaleString('en-GB', {minimumIntegerDigits: 4, useGrouping: false});
                    DTCs[i] = 'TC' + formattedNum + '-00';
                    sliced++;
                }

                for(let i = 0; i < filters.length; i++){
                    await Code.create({DowntimeCode: DTCs[i], DownTimeL1: DTL1,
                        DownTimeL2: req.params.DTL2, DownTimeL3: 'Tool Change', DownTimeL4: req.params.DTL3,
                        AccessLevel: accLvl, Filter: filters[i], Valid: 'Y', Rank: req.params.RANK,
                        Exclude: excl, Description: req.params.DESC}).then( value => {
                            console.log(value);
                            if(req.params.EMAIL === "true"){
                                emailStr = "NEW SUBGROUP IN DATABASE: " + req.params.DTL3 + " in Tool Change, with code: " + DTCs[i] + ". \n Description: "
                                            + req.params.DESC + ". \n For Process: " + filters[i] + ".\n Please contact Process Development if this cannot be rectified."
                                email(emailStr);
                            }});
                }
            }
        } else {
            accLvl = 1;
            var biggest = await Code.max('DowntimeCode', {where: {DowntimeCode: {[Op.like]: 'DT%'}}});
            console.log(biggest)
            if(biggest){
                var number = biggest.slice(2);
                number++;
                console.log(number)
                for(var i = 0; i<filters.length; i++){
                    var formattedNum = number.toLocaleString('en-GB', {minimumIntegerDigits: 3, useGrouping: false});
                    DTCs[i] = 'DT' + formattedNum;
                    number++;
                }

                for(let i = 0; i < filters.length; i++){
                    await Code.create({DowntimeCode: DTCs[i], DownTimeL1: DTL1,
                        DownTimeL2: req.params.DTL2, DownTimeL3: req.params.DTL3, DownTimeL4: req.params.DTL3,
                        AccessLevel: accLvl, Filter: filters[i], Valid: 'Y', Rank: req.params.RANK,
                        Exclude: excl, Description: req.params.DESC}).then( value => {
                            console.log(value);
                            if(req.params.EMAIL === "true"){
                                emailStr = "NEW SUBGROUP IN DATABASE: " + req.params.DTL3 + " in Downtime Codes, with code: " + DTCs[i] + ". \n Description: "
                                             + req.params.DESC + ". \n For Process: " + filters[i] + ".\n Please contact Process Development if this cannot be rectified."
                                email(emailStr);
                            }});
                }
            } 
        }

    }
    catch(e){console.log(e)}
    res.json("added");
});

app.post('/api/database/add/:DTC/:DTL4/:DESC/:EMAIL/:RANK', async (req, res) => {
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
                        DownTimeL2: entry.DownTimeL2, DownTimeL3: entry.DownTimeL4, DownTimeL4: req.params.DTL4,
                        AccessLevel: accLvl, Filter: entry.Filter, Valid: entry.Valid, Rank: req.params.RANK,
                        Exclude: entry.Exclude, Description: req.params.DESC});

                    if(req.params.EMAIL === "true"){
                        emailStr = "NEW CODE IN DATABASE: " + req.params.DTL4 + " in " + entry.DownTimeL4 + " in Downtime Codes, with code: " + newDTC + ". \n Description: "
                                    + req.params.DESC + ". \n For Process: " + entry.Filter + ".\n Please contact Process Development if this cannot be rectified."
                        email(emailStr);
                    }
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
                        AccessLevel: accLvl, Filter: entry.Filter, Valid: entry.Valid, Rank: req.params.RANK,
                        Exclude: entry.Exclude, Description: req.params.DESC});
                    if(req.params.EMAIL === "true"){
                        emailStr = "NEW CODE IN DATABASE: " + req.params.DTL4 + " in " + entry.DownTimeL4 + " in Tool Changes, with code: " + newDTC + ". \n Description: "
                                    + req.params.DESC + ". \n For Process: " + entry.Filter + ".\n Please contact Process Development if this cannot be rectified."
                        email(emailStr);
                    }
                }
            }
            //console.log(newDTC +','+ entry.DownTimeL1+','+entry.DownTimeL2+','+entry.DownTimeL3+','+req.params.DTL4+','+entry.AccessLevel+','+entry.Filter+','+entry.Valid+','+entry.Rank+','+entry.Exclude+','+req.params.DESC);    
        }
    } catch (e) { console.log(e)}
    res.json("added");
});

var server = app.listen(1916, '0.0.0.0', function () {
    console.log('Server is running on port 3000');
});
