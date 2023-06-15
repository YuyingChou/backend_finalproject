import * as React from 'react';
import Map, { Marker,Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as Icon from 'react-bootstrap-icons';
import './app.css';
import { useEffect, useState } from 'react';
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";


const MAPBOX_TOKEN = 'pk.eyJ1IjoieXV5aW5nMDAxIiwiYSI6ImNsaXQzbHEzdTBsMDIzcW96MG5naW9ld3MifQ.2w6eX3UChiGZ0PAgBMv02w'; 

function App() {
  const [viewState, setViewState] = React.useState({
    width: "100vw",
    height: "100vh",
    latitude: 23.33,
    longitude: 121,
    zoom: 8
  });
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins,setPins] =  useState([])
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(()=>{
    const getPins = async()=>{
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins()
  },[]);

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewState({...viewState, latitude:lat, longitude:long });
  };

  const handleAddClick = (e)=>{
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat: lat,
      long : lng
    });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }
    try {
      const res = await axios.post("/pins",newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err)
    }
  };

  const handleLogout = ()=>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  const handleDeletePin = async (id) => {
    try {
      const pinToDelete = pins.find((pin) => pin._id === id);
      if (pinToDelete.username === myStorage.getItem("user")) {
        await axios.delete(`/pins/${id}`);
        setPins((prevPins) => prevPins.filter((pin) => pin._id !== id));
        setCurrentPlaceId(null);
      } 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <Map
        {...viewState}
        mapStyle = "mapbox://styles/mapbox/streets-v9"
        
        mapboxAccessToken = {MAPBOX_TOKEN}
        onMove={evt => setViewState(evt.viewState)}
        onDblClick = {handleAddClick}
        >
        {pins.map(p=>(
<>          
          <Marker 
            longitude={p.long}
            latitude={p.lat} 
            offsetLeft={viewState.zoom *3.5}
            offsetTop={viewState.zoom *7}
          >
            <Icon.GeoAltFill              
              style = {{
                fontSize: viewState.zoom *7, 
                color: p.username===currentUser ? "tomato" : "slateblue",
                cursor: "pointer"
              }}
              onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
            />
          </Marker>    
          {p._id === currentPlaceId &&(
          <Popup 
            longitude={p.long} 
            latitude={p.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={()=>setCurrentPlaceId(null)}
          >
            <div className="card">
              <label>地點</label>
                <h4 className='place'>{p.title}</h4>
              <label>評語</label>
                <p className='desc'>{p.desc}</p>
              <label>評價</label>
                <div className='stars'>
                  {Array(p.rating).fill(<Icon.StarFill className='star'/>)}
                </div>                
              <label>資訊</label>
                <span className='username'>由<b>{p.username}</b>創建</span>
                <span className='date'>{format(p.createdAt)}</span>
                {p.username === myStorage.getItem("user") && (
                  <Icon.TrashFill 
                    className='deletePin'
                    onClick={() => handleDeletePin(p._id)}
                  />                              
                )}
            </div>
        </Popup>
        )}
</>
        ))}
        { newPlace &&(
        <Popup 
            longitude = {newPlace.long} 
            latitude = {newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={()=>setNewPlace(null)}
          >
        <div>
            <form onSubmit={ handleSubmit }>
              <label>地點</label>
              <input 
                placeholder="輸入地名" 
                onChange={(e)=>setTitle(e.target.value)}/>
              <label>評語</label>
              <textarea 
                placeholder='輸入一些你對這個地方的想法'
                onChange={(e)=>setDesc(e.target.value)}/>
              <label>評價</label>
              <select onChange={(e)=>setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className='submitButton' type='submit'>新增圖標</button>
            </form>
        </div>    
        </Popup> 
        )}
        {currentUser ? (<button className='button logout' onClick={handleLogout}>登出</button>) : 
        (
        <div className='buttons'>
          <button 
            className='button login' 
            onClick={()=>setShowLogin(true)}>
            登入
          </button>
          <button 
            className='button register' 
            onClick={()=>setShowRegister(true)}>
            註冊
          </button>
        </div>
        )}     
        { showRegister && <Register setShowRegister={setShowRegister}/> }
        { showLogin && (
            <Login setShowLogin={setShowLogin} 
            myStorage = {myStorage}
            setCurrentUser={setCurrentUser}/>
        )}
        
        
      </Map>
    </div>
    
  );
}
export default App;
