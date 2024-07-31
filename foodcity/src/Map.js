/**
 * Martin Chung, 000790207
 */
import './App.css';
//Custom css for some elements
import './custom.css';
//Import React
import React, {Component} from 'react';
//Import react-bingmaps package to make use of Bing Maps API easier on React
import {ReactBingmaps} from 'react-bingmaps';
//Import button element which would make implementation easier
import Button from 'react-bootstrap/Button';
class Map extends Component {
    //Constructor that will create multiple states
    constructor (props) {
        super(props);
        this.state = {
            //Latitude and longitude data of restaurants
            dataFetch: [],
            //Bing Maps API Key
            bingmapKey:"AjU5qHaYm0YQZaz__V6RcLvnqZtFYqIM1LVJN9rtkcVkcwzoN6SGzE4rv0atuPcA",
            //ID of restaurant selected
            currentId: 0,
            //Information of currently chosen restaurant
            restaurant: [],
            //Current review data
            currentReview: [],
            //Score input from the user when rating a restaurant
            currentScore: {
                score: ""
            },
            //It is not time to enter score yet, as user did not chose to enter rating
            notScoreMode: true,
            //Option buttons will not be available when option is already chosen
            deleteUnavailable: false,
            amendUnavailable: false,
            editUnavailable: false,
            //Delete warning will not be shown when user did not chose to delete the restaurant
            deleteNotConfirmed: true,
            //Do not display rating form unless user choose to rate the restaurant
            doNotDisplay: true,
            notAmendYet: true,
            currentTime: {
                open: "",
                close: ""
            },
            
        }
    }
    //Add pushpin data so Bing Maps API can load restaurants on the map
    pushPinData({id, latitude, longitude}) {
        return ({"location": [latitude, longitude], "id": id, "addHandler": {"type" : "click", callback: this.changeId({id})}})
    }
    //When user chooses a restaurant, gather necessary data
    changeId = param => e => {
        //This will represent current ID of the restaurant
        this.setState({currentId: param.id})

        //Fetch detail about the restaurant
        fetch('http://localhost:3001/api?act=getdetails&id='+param.id+'')
        .then(response => response.json())
        .then(data => {
            this.setState({restaurant: data});
        });
        //Fetch average review score of the restaurant
        fetch('http://localhost:3001/api?act=reviewrestaurant&id='+param.id+'')
        .then(response => response.json())
        .then(data => {
            this.setState({currentReview: data})
            
        });
        //Make rate and delete button available
        this.setState({editUnavailable: false})
        this.setState({deleteUnavailable: false})
        this.setState({amendUnavailable: false})
        //In case review pane is still open, close it
        this.setState({notScoreMode: true})
        //In case delete warning pane is still open, close it
        this.setState({deleteNotConfirmed: true})
        //Display restaurant details
        this.setState({doNotDisplay: false})
        this.setState({notAmendYet: true})
        
    }
    //When the page loads, load location of all restaurants
    componentDidMount() {
        fetch('http://localhost:3001/api?act=getcoords')
        .then(response => response.json())
        .then(data => {
            this.setState({dataFetch: data});
        });
    }
    //When user changes type of the restaurant, filter restaurants by type appropriately
    changeType = param => e => {
        fetch('http://localhost:3001/api?act=specifictypecoords&type='+param+'')
        .then(response => response.json())
        .then(data => {
            
            this.setState({dataFetch: data});
        })
    }
    //When user want to see all restaurants, load location of all restaurants 
    resetFilter = (props) => {
        fetch('http://localhost:3001/api?act=getcoords')
        .then(response => response.json())
        .then(data => {
            this.setState({dataFetch: data});
        });
    }
    //Display detail if user requests the detail
    displayDetail({id, name, type, open_time, close_time, address}){
        this.state.currentTime.open = open_time;
        this.state.currentTime.close = close_time;
        return (
            <div key={id}>
                <h2>{name}</h2>
                <h4>{type} Restaurant</h4>
                <p>Opens: {open_time}<br></br>Closes: {close_time}</p>
                <p>Address: {address}</p>
            </div>
        )
    }
    //Display review information
    reviewDetail({restaurant, score}) {
        //If there is no score data, show message that it has not been rated by anyone yet
        if(score == null) {
            score = "Not rated yet";
        }
        //Otherwise, display review score, which is average of all ratings
        return (
            <div key={restaurant}>
                <h3>Review Score: {score}/10</h3>
            </div>
        )
    }
    //When user submits new score, it will validate input and insert it to database
    handleSubmit = e => {
        //Prevent application from refreshing
        e.preventDefault();
        //Parse integer from user input
        var input = Number.parseInt(this.state.currentScore.score);
        //If user input is not an integer, alert the user that input is not valid
        if(this.state.currentScore.score.length > 2 || !Number.isInteger(input)) {
            alert("This is invalid input.");
        }
        //If input is higher than 10 or lower than 0, alert user that it is invalid
        else if(input > 10 || input < 0) {
            alert("This is invalid input. Score must be between 0 and 10");
        }
        else {
            //Insert new score into database and update review data displayed on the application
            fetch('http://localhost:3001/api?act=insertdata&rest='+this.state.currentId+'&score='+input+'');
            fetch('http://localhost:3001/api?act=reviewrestaurant&id='+this.state.currentId+'')
            .then(response => response.json())
            .then(data => {
                this.setState({currentReview: data})
            
            });
            //When user finishes entering review, hide review entering form and display option buttons again
            this.setState({editUnavailable: false})
            this.setState({deleteUnavailable: false})
            this.setState({amendUnavailable: false})
            this.setState({notScoreMode: true})
            this.state.currentScore.score="";
        }
        
        
    }
    //Hide option buttons and display score input form
    triggerEdit = e =>  {
        this.setState({editUnavailable:true})
        this.setState({deleteUnavailable:true})
        this.setState({amendUnavailable: true})
        this.setState({notScoreMode: false})
    }
    //Hide option buttons and show deletion warning
    triggerDelete = e => {
        this.setState({editUnavailable:true})
        this.setState({deleteUnavailable:true})
        this.setState({amendUnavailable: true})
        this.setState({deleteNotConfirmed: false})
    }
    //Show Change Business Hour Pane
    triggerHours = e => {
        this.setState({editUnavailable: true})
        this.setState({deleteUnavailable: true})
        this.setState({amendUnavailable: true})
        this.setState({notAmendYet: false})
    }
    //When user confirms to delete the restaurant data, mark restaurant information as deleted
    handleDelete = e => {
        //This will not actually delete the restaurant data, only mark it as "deleted" so administrator can check whether it is actually gone
        fetch('http://localhost:3001/api?act=deletedata&id='+this.state.currentId);
        //This will refresh coordination data
        fetch('http://localhost:3001/api?act=getcoords')
        .then(response => response.json())
        .then(data => {
            this.setState({dataFetch: data});
        });
        //Hide detail pane and deletion confirmation pane
        this.setState({deleteNotConfirmed: true})
        this.setState({doNotDisplay: true})
    }
    //Cancel deleting restaurant
    cancelDelete = e => {
        this.setState({deleteNotConfirmed: true})
        this.setState({editUnavailable: false})
        this.setState({deleteUnavailable: false})
        this.setState({amendUnavailable: false})
    }
    //Cancel leaving review
    cancelFeedback = e => {
        this.setState({editUnavailable: false})
        this.setState({deleteUnavailable: false})
        this.setState({notScoreMode: true})
        this.setState({amendUnavailable: false})
    }
    
    //Cancel Changing business hours
    cancelHours = e => {
        this.setState({notAmendYet: true})
        this.setState({editUnavailable: false})
        this.setState({deleteUnavailable: false})
        this.setState({amendUnavailable: false})
    }
    //Modify open time
    handleOpenTime = e => {
        //Based on name of value, get value of the input field
        const {name, value} = e.target;
        this.state.currentTime.open = value;
    };
    //Modify close time
    handleCloseTime = e => {
        const {name, value} = e.target;
        this.state.currentTime.close = value;
    }
    //Update value on form so user can see what they are entering
    scoreChange = e =>  {
        const {name, value} = e.target;
        this.setState( prevState => ({
            currentScore: {...prevState.currentScore,  [name]: value}
        }));
    }
    //This will modify business hours of the restaurant
    handleTimeUpdate = e => {
        var open = this.state.currentTime.open;
        var close = this.state.currentTime.close;
        var openCnt = 0;
        var closeCnt = 0;
        var validOpen = false;
        var validClose = false;
        var realValid = true;
        for(var i=0; i<open.length; i++) {
            var test = open.charAt(i);
            if(Number.isInteger(Number.parseInt(test))) {
                openCnt++;
            }
        }
        for(var i=0; i<close.length; i++) {
            var test = close.charAt(i);
            if(Number.isInteger(Number.parseInt(test))) {
                closeCnt++;
            }
        }
        //Check if time for opening ends with "AM" or "PM"
        if(open.length > 2) {
            if(Number.isInteger(Number.parseInt(open.charAt(0))) && open.charAt(open.length-1).includes("M") && (open.charAt(open.length-2).includes("A") || open.charAt(open.length-2).includes("P"))) {
                validOpen = true;
            }
        }
        //Check if time for closing ends with "AM" or "PM"
        if(close.length > 2) {
            if(Number.isInteger(Number.parseInt(close.charAt(0))) && close.charAt(close.length-1).includes("M") && (close.charAt(close.length-2).includes("A") || close.charAt(close.length-2).includes("P"))) {
                validClose = true;
            }
        }
        //Check validity of the opening time
        if(!validOpen || openCnt < 3 || open.length > 7 || open.length <= 2 || (!open.includes("AM") && !open.includes("PM")) || !open.includes(":")) {
            alert("Open time is invalid");
            realValid = false;
        }
        //Check validity of the closing time
        if(!validClose || closeCnt < 3 || close.length > 7 || close.length <= 2 || (!close.includes("AM") && !close.includes("PM")) || !close.includes(":")) {
            alert("Close time is invalid");
            realValid = false;
        }
        //If both open and close times are valid, update to new data.
        if(realValid) {
            fetch('http://localhost:3001/api?act=changetime&open='+open+'&close='+close+'&id='+this.state.currentId);
            //Fetch detail about the restaurant
            fetch('http://localhost:3001/api?act=getdetails&id='+this.state.currentId+'')
            .then(response => response.json())
            .then(data => {
                this.setState({restaurant: data});
            });
            this.setState({notAmendYet: true})
            this.setState({editUnavailable: false})
            this.setState({deleteUnavailable: false})
            this.setState({amendUnavailable: false})
        }
    }
    
    render() {
        return(
            <div>
                <div>
                    <Button className='choice' variant="outline-secondary" onClick={this.changeType("1")}>Turkish</Button>
                    <Button className='choice' variant="outline-secondary" onClick={this.changeType("2")}>Indian</Button>
                    <Button className='choice' variant="outline-secondary" onClick={this.changeType("3")}>Filipino</Button>
                    <Button className='choice' variant="outline-secondary" onClick={this.changeType("4")}>Japanese</Button>
                    <Button className='choice' variant="outline-secondary" onClick={this.changeType("5")}>Middle Eastern</Button>
                    <Button className='choice' variant="outline-secondary" onClick={this.changeType("6")}>Chinese</Button>
                    <Button className='choice' variant="outline-secondary" onClick={this.resetFilter}>All</Button>
                </div>
                <div className="row">
                    <div className="info card col-md-6" id="mapspace">
                        <div className="card-body">
                        <ReactBingmaps 
                        id = "one"
                        bingmapKey = {this.state.bingmapKey} 
                        center = {[43.2315, -79.8567]}
                        zoom = {12}
                        
                        pushPins = {this.state.dataFetch.map(this.pushPinData.bind(this))}
                        
                        > 
                        </ReactBingmaps>
                        </div>
                        
                    
                    </div>
                    <div hidden={this.state.doNotDisplay} className="col-md-6" id="displayDetails">
                        <div className="info card">
                            <div className="card-body">
                                {this.state.restaurant.map(this.displayDetail.bind(this))}
                                {this.state.currentReview.map(this.reviewDetail.bind(this))}
                            </div>
                            <button hidden={this.state.editUnavailable} onClick={this.triggerEdit} className="btn btn-primary feedback">Rate this Restaurant</button>
                            <button hidden={this.state.amendUnavailable} onClick={this.triggerHours} className="btn btn-primary feedback">Change Business Hours</button>
                            <button hidden={this.state.deleteUnavailable} onClick={this.triggerDelete} className="btn btn-primary feedback">Delete this Restaurant</button>
                        </div>
                       
                        
                        <div>
                            
                            <div className="info card" hidden={this.state.notScoreMode}>
                                <form>
                                    <div className="card-body form-group">
                                        <h1>Submit Rating</h1>
                                        <label htmlFor="scoreinput">Enter Score (0 - 10, do not put decimal)</label><br></br>
                                        <input className="form-control" maxLength="2" id="scoreinput" name="score" type="text" value={this.state.currentScore.score} onChange={this.scoreChange} ></input>
                                        
                                    </div>
                                    
                                
                                </form>
                                <button className="btn btn-primary feedback" onClick={this.handleSubmit}>Submit</button>
                                <button className="btn btn-primary feedback" onClick={this.cancelFeedback}>Cancel</button>
                            </div>
                            
                            <div className="info card" hidden={this.state.deleteNotConfirmed}>
                                <div className="card-body">
                                    <h1>Warning</h1>
                                    <p>You are about to delete the restaurant. Are you sure you want to continue? This will temporarily make restaurant invisible.</p>
                                </div>
                                
                                <button onClick={this.handleDelete} className="btn btn-primary feedback">Delete</button>
                                <button onClick={this.cancelDelete} className="btn btn-primary feedback">Cancel</button>
                            </div>
                            <div className="info card" hidden={this.state.notAmendYet}>
                                <form>
                                    <div className="card-body form-group">
                                        <h1>Edit Business Hours</h1>
                                        <p>Enter time as this format: HH:MM AM/PM (Ex: 4:00PM)</p>
                                        <label type="text" htmlFor="editOpen">Open Time</label>
                                        <input id="editOpen" name="open" className="form-control" onChange={this.handleOpenTime}></input>
                                        <label htmlFor="editClose">Close Time </label>
                                        <input id="editClose" name="close" className="form-control" onChange={this.handleCloseTime}></input>
                                    </div>
                                </form>
                                <button onClick={this.handleTimeUpdate} className="btn btn-primary feedback">Update</button>
                                <button onClick={this.cancelHours} className="btn btn-primary feedback">Cancel</button>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </div>
            
        ) 
    }
}
export {Map}; 