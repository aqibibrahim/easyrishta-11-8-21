import React, { useEffect } from "react";
import firebase from "firebase";
import logo from "./images/150X150-LOGO.png";
import chat from "./chat";
import dots from "./images/three-dots.jpg";
import preloader from "./../../src/pages/images/easyrishtapre.png";
import dotsThree from "./images/dots-custom.png";
import { Link } from "react-router-dom";
import { db } from "../../src/pages/firebase-config";
import { useQuery } from "react-query";
// import React, { useEffect } from 'react';

import './notifications.css';
export default function Notificatoins() {

  var docsid = "";
  let invites_array = [];
  var username1 = "";
  var inviteslength = 0;
  // const [state, setstate] = useState({
  //   username: "",
  //   profession: "",
  //   education: "",
  //   specialization: "",
  //   address: "",
  //   notificationlength: 0,
  //   notificationdata: [],
  //   gallery: [],
  //   notificationid: "",
  //   userid: "",
  //   data: [],
  // });
  // const [preferences, setPreferences] = useState({
  //   cast: "Abbasi",
  //   gender: "male",
  //   maximumage: "18",
  //   minimumage: "18",
  //   maximumheight: "4.6",
  //   minmumheight: "4.6",
  //   userid: localStorage.getItem("userid"),
  // });

  const profiles = useQuery(
    "profile",
    () => {
      const email = localStorage.getItem("email");
      username1 = localStorage.getItem("username");
      console.log("User NAme", username1);
      //   console.log(localStorage.getItem("userid"));
      return db.collection("users").where("email", "==", email).get();
    },
    {
      select: (querySnapshot) => {
        const doc = querySnapshot.docs[0].data();
        docsid = querySnapshot.docs[0].id;
        // console.log("DOC ::", doc);
        console.log("DOC ::", docsid);
        return doc;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );
  useEffect(() => {
    db.collection("invites")
      .where("recieverid", "==", localStorage.getItem("loggedin-userid"))
      .get()
      .then((res) => {
        console.log(res.docs.length);
        const invite_array = [];

        // console.log(querySnapshot.docs[0].data());
        for (var i = 0; i < res.docs.length; i++) {
          invite_array.push({
            data: res.docs[i].data(),
            userid: res.docs[i].id,
          });
        }

        invites_array = invite_array;
        // console.log(invite_array);
        // inviteslength = invites_array.length;
        console.log(invites_array.length);
        console.log(invites_array);
      });
    ///---------- get login user prefernces End
  }, []);
  const invites = useQuery(
    "invites",
    () => {
      return db.collection("invites").where("recieverid", "==", docsid).get();
    },
    {
      select: (querySnapshot) => {
        // let temp = [];
        const doc = querySnapshot.docs[0].data();

        console.log("Invite docs", doc);

        const invite_array = [];
        console.log(querySnapshot.docs[0].data());
        for (var i = 0; i < querySnapshot.docs.length; i++) {
          invite_array.push({
            data: querySnapshot.docs[i].data(),
            userid: querySnapshot.docs[i].id,
          });
        }

        invites_array = invite_array;
        console.log(invite_array.length);
        inviteslength = invites_array.length;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );

  if (!invites_array)
    return (
      <div
        class="lds-heart"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      >
        <div></div>
      </div>
    );

  console.warn("profiles ::  ", profiles.data);
  console.warn("invites ::  ", invites.data);

  const handleAccept = async (senderData, inviteId) => {
    console.log({ fromAcceptHandle: senderData, inviteId: inviteId });

    if (senderData.type === "chat") {
      console.log("chat request");
      db.collection("users")
        .doc(localStorage.getItem("loggedin-userid"))
        .update({
          accepted_chat_request: firebase.firestore.FieldValue.arrayUnion({
            accepted_user_id: senderData.userid
          }),
        })
        .then(() => {
          db.collection("users")
            .doc(senderData.userid)
            .update({
              accepted_chat_request: firebase.firestore.FieldValue.arrayUnion({
                accepted_user_id: senderData.recieverid
              }),
            })
            .then(() => {
              let chatids = senderData.userid + localStorage.getItem("loggedin-userid");
              db.collection("users").doc(senderData.userid).update({
                  chat_ids: firebase.firestore.FieldValue.arrayUnion({
                    chatid: chatids,
                    chatperson: localStorage.getItem("username")
                  })
              }).then(()=>{
                db.collection("users").doc(senderData.recieverid).update({
                  chat_ids: firebase.firestore.FieldValue.arrayUnion({
                    chatid: chatids,
                    chatperson: senderData.requestperson
                  })
              }).then(()=>{
                db.collection("invites").doc(inviteId).delete().then((res)=>{
                  alert("Accept Chat Suucesfully")
                  window.location.href = '/chat';
                });
              })
            })
            });
        });
    } else {
      console.log(senderData.type);
      db.collection("users")
        .doc(senderData.recieverid)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion({
            userid: senderData.userid,
            userpic: senderData.profilepic ? senderData.profilepic : "",
            name: senderData.requestperson,
          }),
        })
        .then(() => {
          db.collection("users")
            .doc(senderData.userid)
            .update({
              friends: firebase.firestore.FieldValue.arrayUnion({
                userid: senderData.recieverid,
                userpic: localStorage.getItem("profilepic")
                  ? localStorage.getItem("profilepic")
                  : "",
                name: localStorage.getItem("username"),
              }),
            })
            .then(() => {
              db.collection("invites").doc(inviteId).delete();

            });
        });
    }
  };

  const handleReject = async (inviteId) => {
    db.collection("invites").doc(inviteId).delete();
  };
  if (!profiles.data)
    return (
      <div
        class="lds-heart pulse-button"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      >
        <div></div>
      </div>
    );

  return (
    <div>
      <body class="hold-transition sidebar-mini" />
      <div class="wrapper">
        {/*  <!-- Navbar --> */}
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
          {/*   <!-- Left navbar links --> */}
          <ul class="navbar-nav">
            {/* <li class="nav-item">
              <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fas fa-bars"></i>
              </a>
            </li> */}
            <li class="nav-item d-none d-sm-inline-block">
              <a href=" index.html" class="nav-link">
                Home
              </a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
              <a href="findMatch.html" class="nav-link">
                Find Match
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

            {/* <!-- Notifications Dropdown Menu --> */}
            <li class="nav-item dropdown">
              <a
                class="nav-link"
                href="/notifications"
                rel="noreferrer noopener"
                target="_blank"
              >
                <i class="far fa-bell"></i>
                <span class="badge badge-warning navbar-badge">
                  {localStorage.getItem("inviteslength")}
                </span>
              </a>
            </li>

          </ul>
        </nav>
        {/*  <!-- /.navbar --> */}

        {/*  <!-- Main Sidebar Container --> */}
        <aside
          class="main-sidebar sidebar-dark-primary elevation-4"
          style={{ background: "#EDCBBD " }}
        >
          {/* <!-- Brand Logo --> */}
          <a href="index.html" class="brand-link">
            <img
              src={logo}
              alt="AdminLTE Logo"
              style={{ height: "auto", width: "70%", paddingLeft: "30%" }}
            />
          </a>

          {/*  <!-- Sidebar --> */}
          <div class="sidebar">
            {/* <!-- Sidebar user (optional) --> */}
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
              <div class="image">
                <img
                  src={localStorage.getItem("profilepic")}
                  class="img-circle elevation-2"
                  alt="User"
                />
              </div>
              <div class="info">
                <Link
                  to={"/profile"}
                  class="d-block"
                  style={{ color: "black" }}
                >
                  {localStorage.getItem("username")}
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
                    to={"/search"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-search"></i>
                    <p>Search</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/chat"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Chat</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/preferences"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Set Preferences</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/register"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>Update Pofile</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/friends"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>Friends</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/membership"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>Membership</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                {/* <li class="nav-item">
                  <Link
                    to={"/notifications"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>Notifications</p>
                    <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge>
                  </Link>
                </li> */}
              </ul>
            </nav>
            {/*  <!-- /.sidebar-menu --> */}
          </div>
          {/*  <!-- /.sidebar --> */}
        </aside>

        {/*  <!-- Content Wrapper. Contains page content --> */}
        <div class="content-wrapper">
          {/*  <!-- Content Header (Page header) --> */}
          <section class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-6">
                  {/* <h1>Notifications</h1> */}
                </div>
                <div class="col-sm-6">
                  <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li class="breadcrumb-item active"> My Profile</li>
                  </ol>
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>

          {/* <!-- Main content --> */}
          <section class="">
            <div class="container-fluid">
              <div class="row">
                {/*   <!-- /.col --> */}
                <div class="col-md-3"></div>
                <div class="col-md-6">
                {invites_array != null ? (
                  invites_array.length > 0 ? (
                  <div class="card-custom heart-custom">
                    {/* <!-- /.card-header --> */}
                    <div class="card-body">
                      <div class="tab-content">
                      <div class="tab-header d-flex justify-content-between ">
                      <h4>Notifications</h4>


                        </div>
                                 <div
                                              >
                          <div class="d-flex  align-items-stretch flex-wrap justify-content-center overflow-y-scroll">

                             {invites_array != null ? (
                  invites_array.length > 0 ? (
                    invites_array.map((val) => {
                      return (
                        <div
                        class="row   notification-bar"
                        style={{
                          width: "100%",

                          // marginLeft: "2.5%",
                          // background:"#FDEAEF",
                        }}
                      >
                        <div
                          class="col-2"
                          style={{ textAlign: "center" }}
                        >
                          <img
                            src={val.data.profilepic}
                            alt=""
                            class="img-circle img-fluid"
                            style={{ height: 50, width: 50 }}
                          />
                        </div>

                        <div class="col-6">
                          <p class="text-muted text-sm">
                            <b>{val.data.type} Request: </b>
                            {val.data.requestperson}
                            {val.data.type === "photo"
                              ? "Wants to access your photos"
                              : val.data.type === "intrest"
                              ? "Shows some interest in your profile"
                              : "Wants to build to relation with you"}
                          </p>
                        </div>
                        <div
                          class="col-4"
                          style={{ textAlign: "center" }}
                        >
                          <div>
                            {/* <button
                              class="btn-sm btn-primary m-1 p-1"
                              style={{
                                backgroundColor: "#0C6B09",
                              }}
                              onClick={() => {
                                handleAccept(val.data, val.userid);
                              }}
                            >
                              Accept
                            </button> */}
                            <div class="dropdown dots-circle-btn">
                                  <button className="custom-btn  dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <img
                            src={dotsThree}
                            alt=""
                            class="img-circle  "
                            style={{ height: 34, width: 34 ,padding:"5px",backgroundColor:"#fffff"}}
                          />
                      </button>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
                      <button className="dropdown-item"
                      onClick={() => {
                      handleAccept(val.data, val.userid);
                      }}
                      type="button">Accept</button>

                      <button className="dropdown-item"
                      onClick={() => {
                      handleReject(val.userid);
                      }}
                      type="button">Reject</button>
                      </div>
                      </div>
                            {/* <button
                              class="btn-sm btn-primary m-1 p-1"
                              style={{
                                backgroundColor: "#ed225c",
                              }}
                              onClick={() => {
                                handleReject(val.userid);
                              }}
                            >
                              Reject
                            </button> */}
                          </div>
                        </div>
                      </div>
                      );
                    })
                  ) : (
                    <div
                      class="lds-heart"
                      style={{ position: "absolute", top: "20%", left: "50%" }}
                    >
                      <div></div>
                    </div>
                  )
                ) : (
                  <div
                    class="lds-heart"
                    style={{ position: "absolute", top: "20%", left: "50%" }}
                  >
                    <div></div>
                  </div>
                )}


                          </div>
                        </div>
                        {/* intrest: person name show some intrest in your profile
                        photos: name wnat to access your photos chat: name want
                        to build to relation with you */}
                      </div>
                      {/* <!-- /.tab-content --> */}
                    </div>
                    {/* <!-- /.card-body --> */}
                  </div>

) : (
  <div
    class="lds-heart"
    style={{ position: "absolute", top: "150px", left: "50%" }}
  >
    <div></div>
  </div>
)
) : (
<div
  class="lds-heart"
  style={{ position: "absolute", top: "150px", left: "50%" }}
>
  <div></div>
</div>
)}

                  {/* <!-- /.nav-tabs-custom --> */}
                </div>
                <div class="col-md-3"></div>
                {/* <!-- /.col --> */}
              </div>
              {/* <!-- /.row --> */}
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
        {/* <!-- /.content-wrapper --> */}
        <footer class="main-footer">
          <strong>
            Copyright &copy; 2021 <a href="www.quellxcode.com"> QuellxCode</a>.
          </strong>
          All rights reserved.
        </footer>

        {/*   <!-- Control Sidebar --> */}
        <aside class="control-sidebar control-sidebar-dark">
          {/* <!-- Control sidebar content goes here --> */}
        </aside>
        {/* <!-- /.control-sidebar --> */}
      </div>
      {/* <!-- ./wrapper --> */}
    </div>
  );
}
