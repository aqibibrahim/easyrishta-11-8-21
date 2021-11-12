import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./images/150X150-LOGO.png";
import logo1 from "./images/user1-128x128.jpg";
import chatUser from "./images/chat-user.jpg";
import user from "./images/user1-128x128.jpg";
import userAvatar from "./images/user4-128x128.jpg";
import { auth, db } from "../../src/pages/firebase-config";
import firebase from "firebase";
import "./chat.css";
import { useQuery } from "react-query";
export default function Char() {
  //   useEffect(() => {});
  const [selectedUser, setSelectedUSer] = useState("");
  const [message, setMessage] = useState("");
  const [chat_array, setChat_array] = useState("");
  var accepted_chat_array = [];
  var chat_ids = [];

  const GetChats = useQuery(
    "getchats",
    () => {
      const userid = localStorage.getItem("userid");
      //console.log(localStorage.getItem("userid"));
      return db.collection("users").doc(userid).get();
    },
    {
      select: (querySnapshot) => {
        const doc = {
          accepted_chat_array: querySnapshot.data().accepted_chat_request,
          chat_ids: querySnapshot.data().chat_ids,
        };
        // console.log("userData", doc);
        chat_ids = doc.chat_ids;
        accepted_chat_array = doc.accepted_chat_array;
        return doc;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );
  const onSelectUesr = async (userid) => {
    setSelectedUSer(userid);
    console.log({ chat_ids });



    const messages = [];

    if (chat_ids.includes(selectedUser + localStorage.getItem("userid"))) {
      db.collection('chats', ref => ref.orderBy('order field'));


     db.collection("chats")
        .doc(selectedUser + localStorage.getItem("userid"))
        .collection("messages")
        .orderBy("timeStamp", "asc")
        .onSnapshot((val) => {
          console.log("true If");
          var bar = new Promise((resolve, reject) => {
            val.docs.forEach((mes, index, array) => {
              messages.push(mes.data());
              if (index === array.length - 1) resolve();
            });
          });
          bar.then(() => {
           
            console.log({ messages });

            setChat_array(messages);
            
          });
        });
    } else if (
      chat_ids.includes(localStorage.getItem("userid") + selectedUser)
    ) {
      db.collection("chats")
        .doc(localStorage.getItem("userid") + selectedUser)
        .collection("messages")
        .orderBy("timeStamp", "asc")
        .onSnapshot((val) => {
          console.log("true If");
          var bar = new Promise((resolve, reject) => {
            val.docs.forEach((mes, index, array) => {
              messages.push(mes.data());
              if (index === array.length - 1) resolve();
            });
          });
          bar.then(() => {
            console.log({ messages });
            setChat_array(messages);
          });
        });
    }
  };
  

   

  const handleSendMessage = async () => {
    db.collection("chat")
      .doc(localStorage.getItem("userid") + selectedUser)
      .collection("messages")
      .get()
      .then((res) => {
        if (res.empty) {
          db.collection("chat")
            .doc(selectedUser + localStorage.getItem("userid"))
            .collection("messages")
            .get()
            .then((res2) => {
              if (res2.empty) {
                db.collection("chat")
                  .doc(selectedUser + localStorage.getItem("userid"))
                  .collection("messages")
                  .add({
                    messageText: message,
                    senderId: localStorage.getItem("userid"),
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .then((res3) => {
                    console.log(res3);
                    db.collection("users")
                      .doc(localStorage.getItem("userid"))
                      .update({
                        chatids: firebase.firestore.FieldValue.arrayUnion(
                          selectedUser + localStorage.getItem("userid")
                        ),
                      });
                    db.collection("users")
                      .doc(selectedUser)
                      .update({
                        chatids: firebase.firestore.FieldValue.arrayUnion(
                          selectedUser + localStorage.getItem("userid")
                        ),
                      });
                  });
              } else {
                db.collection("chat")
                  .doc(selectedUser + localStorage.getItem("userid"))
                  .collection("messages")
                  .add({
                    messageText: message,
                    senderId: localStorage.getItem("userid"),
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  });
              }
              console.log("preChat2", res2.empty);
            });
        } else {
          db.collection("chat")
            .doc(localStorage.getItem("userid") + selectedUser)
            .collection("messages")
            .add({
              messageText: message,
              senderId: localStorage.getItem("userid"),
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((res) => {
              console.log(res);
              db.collection("users")
                .doc(localStorage.getItem("userid"))
                .update({
                  chatids: firebase.firestore.FieldValue.arrayUnion(
                    localStorage.getItem("userid") + selectedUser
                  ),
                });
              db.collection("users")
                .doc(selectedUser)
                .update({
                  chatids: firebase.firestore.FieldValue.arrayUnion(
                    localStorage.getItem("userid") + selectedUser
                  ),
                });
            });
        }
        console.log("preChat", res.empty);
      });
  };
  //   const MatchMaking = useQuery(
  //     "matchmaking",
  //     () => {
  //       // console.log(GetPreferences.data);
  //       const citiesRef = db.collection("users");
  //       console.log(preferences);
  //       return citiesRef
  //         .where("profile.gender", "==", preferences.gender)
  //         .where("profile.caste", "==", preferences.cast)
  //         .get();

  //     },
  //     {
  //       select: (querySnapshot) => {
  //         // const doc = querySnapshot;
  //         const user_array = [];
  //         console.log({ from: querySnapshot.docs[0].data() });
  //         for (var i = 0; i < querySnapshot.docs.length; i++) {
  //           if (preferences) {
  //             if (
  //               querySnapshot.docs[i].data().profile.height <=
  //                 preferences.maximumheight &&
  //               querySnapshot.docs[i].data().profile.height >=
  //                 preferences.minmumheight &&
  //               querySnapshot.docs[i].data().profile.age <=
  //                 preferences.maximumage &&
  //               querySnapshot.docs[i].data().profile.age >= preferences.minimumage
  //             ) {
  //               user_array.push({
  //                 data: querySnapshot.docs[i].data(),
  //                 userid: querySnapshot.docs[i].id,
  //               });
  //             }
  //           } else {
  //             user_array.push({
  //               data: querySnapshot.docs[i].data(),
  //               userid: querySnapshot.docs[i].id,
  //             });
  //           }
  //         }
  //         //console.log(user_array);
  //         users_array = user_array;
  //         console.log({ users_array });
  //         // const docsid = querySnapshot.forEach((res) => {
  //         //   console.log(res.data());.
  //         // });
  //         // console.log("DOC ::", doc);
  //         // console.log("DOC ::", docsid);
  //         // return docsid;
  //       },
  //       onError: (error) => console.log("Error getting documents: ", error),
  //     }
  //   );

  return (
    <div>
      <div class="wrapper">
        {/* <!-- Navbar --> */}
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
          {/* <!-- Left navbar links --> */}
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fas fa-bars"></i>
              </a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
              <a href=" index.html" class="nav-link">
                Home
              </a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
              <a href="findMatch.html" class="nav-link">
                {" "}
                Match Making{" "}
              </a>
            </li>
          </ul>

          {/* <!-- SEARCH FORM --> */}
          <form class="form-inline ml-3">
            <div class="input-group input-group-sm">
              <input
                class="form-control form-control-navbar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div class="input-group-append">
                <button class="btn btn-navbar" type="submit">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>

          {/* <!-- Right navbar links --> */}
          <ul class="navbar-nav ml-auto">
            {/* <!-- Messages Dropdown Menu --> */}
            <li class="nav-item dropdown">
              <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="far fa-comments"></i>
                <span class="badge badge-danger navbar-badge">3</span>
              </a>
              <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <a href="#" class="dropdown-item">
                  {/* <!-- Message Start --> */}
                  <div class="media">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      class="img-size-50 mr-3 img-circle"
                    />
                    <div class="media-body">
                      <h3 class="dropdown-item-title">
                        Brad Diesel
                        <span class="float-right text-sm text-danger">
                          <i class="fas fa-star"></i>
                        </span>
                      </h3>
                      <p class="text-sm">Call me whenever you can...</p>
                      <p class="text-sm text-muted">
                        <i class="far fa-clock mr-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!-- Message End --> */}
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  {/* <!-- Message Start --> */}
                  <div class="media">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      class="img-size-50 img-circle mr-3"
                    />
                    <div class="media-body">
                      <h3 class="dropdown-item-title">
                        John Pierce
                        <span class="float-right text-sm text-muted">
                          <i class="fas fa-star"></i>
                        </span>
                      </h3>
                      <p class="text-sm">I got your message bro</p>
                      <p class="text-sm text-muted">
                        <i class="far fa-clock mr-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!-- Message End --> */}
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  {/* <!-- Message Start --> */}
                  <div class="media">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      class="img-size-50 img-circle mr-3"
                    />
                    <div class="media-body">
                      <h3 class="dropdown-item-title">
                        Nora Silvester
                        <span class="float-right text-sm text-warning">
                          <i class="fas fa-star"></i>
                        </span>
                      </h3>
                      <p class="text-sm">The subject goes here</p>
                      <p class="text-sm text-muted">
                        <i class="far fa-clock mr-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!-- Message End --> */}
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">
                  See All Messages
                </a>
              </div>
            </li>
            {/* <!-- Notifications Dropdown Menu --> */}
            <li class="nav-item dropdown">
              <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="far fa-bell"></i>
                <span class="badge badge-warning navbar-badge">15</span>
              </a>
              <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header">
                  15 Notifications
                </span>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-envelope mr-2"></i> 4 new messages
                  <span class="float-right text-muted text-sm">3 mins</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-users mr-2"></i> 8 friend requests
                  <span class="float-right text-muted text-sm">12 hours</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-file mr-2"></i> 3 new reports
                  <span class="float-right text-muted text-sm">2 days</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">
                  See All Notifications
                </a>
              </div>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-widget="control-sidebar"
                data-slide="true"
                href="#"
              >
                <i class="fas fa-th-large"></i>
              </a>
            </li>
          </ul>
        </nav>
        {/* <!-- /.navbar -->

  <!-- Main Sidebar Container --> */}
        <aside
          class="main-sidebar sidebar-dark-primary elevation-4"
          style={{ background: "#EDCBBD " }}
        >
          {/* <!-- Brand Logo --> */}
          <a href="/" class="brand-link">
            <img
              src={logo}
              alt="AdminLTE Logo"
              style={{
                height: "auto",
                width: "70%",
                paddingLeft: "30%",
              }}
            />
          </a>

          {/* <!-- Sidebar --> */}
          <div class="sidebar">
            {/* <!-- Sidebar user (optional) --> */}
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
              <div class="image">
                <img
                  src={logo1}
                  class="img-circle elevation-2"
                  alt="User Image"
                />
              </div>
              <div class="info">
                <Link
                  to={"/profile"}
                  class="d-block"
                  style={{ color: "black" }}
                >
                  Nina Mcintire
                </Link>
              </div>
            </div>

            {/* <!-- Sidebar Menu --> */}
            <nav class="mt-2">
              <ul
                class="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {/* <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library --> */}

                <li class="nav-item">
                  <Link
                    to={"/profile"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>My Profile</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/MatchMaking"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-search"></i>
                    <p>Find Match</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/messages"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Messages</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* <!-- /.sidebar-menu --> */}
          </div>
          {/* <!-- /.sidebar --> */}
        </aside>

        {/* <!-- Content Wrapper. Contains page content --> */}
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          {/* <section class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1>Chat Room</h1>
                </div>
                <div class="col-sm-6">
                  <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Find Match</li>
                  </ol>
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> 
          </section> */}
{/* -------------------------------------------------------------chat-- */}



<div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Recent</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="search-bar"  placeholder="Search" />
                <span class="input-group-addon">
                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div class="inbox_chat">
          {accepted_chat_array.map((val) => (

<div class="chat_list active_chat">

{val.userpic == "" ?  <img
                      class="profile-user-img img-fluid img-circle  "
                      
                      src={userAvatar}
                      alt=" No Image"
                      style={{ height: 200, width: 200 }}
                    /> :
                    <div class="chat_people">
                <div class="chat_img"> <img src={val.userpic} className="user-profile" alt="Image"/> </div>
                <div class="chat_ib">
                  <h5>{val.name} <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new .</p>
                </div>
              </div>
                   } 

              </div>
              
              ))}
         
            
          
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history">
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src={chatUser}  alt="sunil"/> </div>
              <div class="received_msg chat-bubble">
                <div class="received_withd_msg">
                  <p>Test which is a new approach to have all
                    solutions</p>
                  <span class="time_date"> 11:01 AM    |    June 9</span></div>
              </div>
            </div>
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p>Test which is a new approach to have all
                  solutions</p>
                <span class="time_date"> 11:01 AM    |    June 9</span> </div>
            </div>
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src={chatUser} alt="sunil"/> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>Test, which is a new approach to have</p>
                  <span class="time_date"> 11:01 AM    |    Yesterday</span></div>
              </div>
            </div>
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p>Apollo University, Delhi, India Test</p>
                <span class="time_date"> 11:01 AM    |    Today</span> </div>
            </div>
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src={chatUser} alt="sunil"/> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>We work directly with our designers and suppliers,
                    and sell direct to you, which means quality, exclusive
                    products, at a price anyone can afford.</p>
                  <span class="time_date"> 11:01 AM    |    Today</span></div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg" placeholder="Type a message" />
              <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
      
      
  
    </div>
{/* -------------------------------------------------------------chat-- */}
          <section class="content d-flex  justify-content-center">
            <div class="row">
              <div class="col-md-2"></div>
            </div>
          </section>
          {/* <!-- Main content --> */}
          <section class="content d-flex ">
            {/* <!-- Default box --> */}
            <div
              class="row d-flex"
              style={{ width: "30%", flexDirection: "column" }}
            >
              {accepted_chat_array.map((val) => (
                <div
                  style={{
                    margin: "20px",
                  }}
                  onClick={() => {
                    onSelectUesr(val.userid);
                  }}
                >
                  <div></div>
                  <img
                    src={val.userpic}
                    style={{
                      height: "70px",
                      width: "70px",
                      borderRadius: "50%",
                    }}
                  />
                  <label style={{ fontSize: "30px", margin: "5px" }}>
                    {" "}
                    {val.name}
                  </label>
                </div>
              ))}
            </div>
            <div
              class="row d-flex  justify-content-center"
              style={{ flexDirection: "column", width: "70%" }}
            >
              <div class="d-flex align-items-stretch flex-wrap justify-content-center">
                <div
                  class="card bg-light m-2"
                  style={{
                    maxHeight: "500px",
                    overflow: "scroll",
                    marginLeft: "2.5%",
                    padding: "20px",
                    width: "80%",
                    display: selectedUser ? "" : "none",
                  }}
                >    
                  {chat_array.length > 0 ? (
                    chat_array.map((val) => (
                      <div
                        style={{
                          justifyContent:
                            val.senderId === localStorage.getItem("userid")
                              ? "right"
                              : "left",
                          display: "flex",
                        }}
                      >
                        <p
                          style={{
                            maxWidth: "250px",
                            // minWidth: "200px",
                            background: "#FCD6E1",
                            padding: "10px",
                            borderRadius: "10px",
                          }}
                        >
                          {val.messageText}
                        </p>
                      </div>
                    ))
                  ) : (
                    <h1>No Message Found</h1>
                  )}
                </div>
              </div>
              <div class="form-inline ml-3 d-flex align-items-stretch flex-wrap justify-content-center">
                <div
                  class="input-group input-group-sm"
                  style={{ width: "80%", display: selectedUser ? "" : "none" }}
                >
                  <input
                    class="form-control form-control-navbar"
                    type="search"
                    placeholder="Type Message"
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-navbar"
                      type="submit"
                      style={{
                        background: "#FCD6E1",
                      }}
                      onClick={handleSendMessage}
                    >
                      {/* <i class="fa fa-paper-plane"></i> */}
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <!-- /.content --> */}
        </div>
        {/* <!-- /.content-wrapper --> */}

        <footer class="main-footer">
          <strong>
            Copyright &copy; 2021{" "}
            <a href="https://quellxcode.com/"> QuellxCode</a>.
          </strong>
          All rights reserved.
        </footer>

        {/* <!-- Control Sidebar --> */}
        <aside class="control-sidebar control-sidebar-dark">
          {/* <!-- Control sidebar content goes here --> */}
        </aside>
        {/* <!-- /.control-sidebar --> */}
      </div>
    </div>
  );
}
