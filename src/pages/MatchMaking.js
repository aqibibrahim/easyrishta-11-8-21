import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./images/150X150-LOGO.png";
import { useHistory } from "react-router-dom";
import { db } from "../../src/pages/firebase-config";
import './MatchMaking.css';
// import { useQuery } from "react-query";
import * as _ from "lodash";

export default function MatchMaking(props) {
  // var docsid = "";
  const history = useHistory();
  const [users_array, setUsers_array] = useState([]);
  // const [loader, setLoader] = React.useState(false);
  useEffect(() => {
    // setLoader(true);
    ///---------- get login user prefernces

    const userid = localStorage.getItem("userid");
    //console.log(localStorage.getItem("userid"));
    db.collection("prefernces")
      .where("userid", "==", userid)
      .get()
      .then(async (data) => {
        console.log(data);
        // setLoader(false);
        if (data.empty) {
          window.open("/preferences", "_blank");
          //history.push("/preferences");
          return;
        }
        const uesrPrefences = data.docs[0].data();
        const citiesRef = db.collection("users");
        console.log({ uesrPrefences });

        const cast = await citiesRef
          .where("profile.caste", "==", uesrPrefences.cast)
          .get();

        const gender = await citiesRef
          .where("profile.gender", "==", uesrPrefences.gender)
          .get();

        const mini_height = await citiesRef
          .where("profile.height", ">=", uesrPrefences.minmumheight)
          .get();
        const max_height = await citiesRef
          .where("profile.height", "<=", uesrPrefences.maximumheight)
          .get();
        const max_age = await citiesRef
          .where("profile.age", "<=", uesrPrefences.maximumage)
          .get();
        const min_age = await citiesRef
          .where("profile.age", ">=", uesrPrefences.minimumage)
          .get();

        const sect = await citiesRef
          .where("profile.age", ">=", uesrPrefences.sect)
          .get();
        const education = await citiesRef
          .where("profile.age", ">=", uesrPrefences.education)
          .get();
        const nationality = await citiesRef
          .where("profile.age", ">=", uesrPrefences.nationality)
          .get();

        // const [gender1, cast1, mini_height1, max_height1, min_age1, max_age1] =
        //   Promise.all([
        //     gender,
        //     cast,
        //     mini_height,
        //     max_height,
        //     min_age,
        //     max_age,
        //   ]);

        const genderArray = gender.docs;
        const cast1Array = cast.docs;
        const mini_height1Array = mini_height.docs;
        const max_height1Array = max_height.docs;
        const min_age1Array = min_age.docs;
        const max_age1Array = max_age.docs;
        const sect_Array = sect.docs;
        const education_Array = education.docs;
        const nationality_Array = nationality.docs;
        // console.log({
        //   genderArray,
        //   cast1Array,
        //   mini_height1Array,
        //   max_height1Array,
        //   min_age1Array,
        //   max_age1Array,
        // });

        const citiesArray = _.concat(
          genderArray,
          cast1Array,
          mini_height1Array,
          max_height1Array,
          min_age1Array,
          max_age1Array,
          sect_Array,
          education_Array,
          nationality_Array
        );

        // console.log({ citiesArray });

        const finalData = await _.uniqWith(citiesArray, _.isEqual).map((e) => {
          let total = 0;
          let match = 0;
          if (uesrPrefences.gender) {
            total++;
            if (uesrPrefences.gender === e.data().profile.gender) match++;
          }
          if (uesrPrefences.cast) {
            total++;
            if (uesrPrefences.cast === e.data().profile.caste) match++;
          }
          if (uesrPrefences.maximumage) {
            total++;
            if (uesrPrefences.maximumage >= e.data().profile.age) match++;
          }
          if (uesrPrefences.minimumage) {
            total++;
            if (uesrPrefences.minimumage <= e.data().profile.age) match++;
          }
          if (uesrPrefences.maximumheight) {
            total++;
            if (uesrPrefences.maximumheight >= e.data().profile.height) match++;
          }
          if (uesrPrefences.minmumheight) {
            total++;
            if (uesrPrefences.minmumheight <= e.data().profile.height) match++;
          }
          if (uesrPrefences.sect) {
            total++;
            if (uesrPrefences.sect === e.data().profile.sect) match++;
          }
          if (uesrPrefences.education) {
            total++;
            if (uesrPrefences.education === e.data().profile.education) match++;
          }
          if (uesrPrefences.nationality) {
            total++;
            if (uesrPrefences.nationality === e.data().profile.nationality)
              match++;
          }

          match = Math.round((match / total) * 100);
          console.log(e.data());
          return { data: e.data(), match: match, userid: e.id };
        });
        setUsers_array(finalData);
        console.log({ finalData });
      });

    ///---------- get login user prefernces End
  }, []);
  // const profiles = useQuery(
  //   "profile",
  //   () => {
  //     const email = localStorage.getItem("email");
  //     //   console.log(localStorage.getItem("userid"));
  //     return db.collection("users").where("email", "==", email).get();
  //   },
  //   {
  //     select: (querySnapshot) => {
  //       const doc = querySnapshot.docs[0].data();
  //       docsid = querySnapshot.docs[0].id;
  //       // console.log("DOC ::", doc);
  //       console.log("DOC ::", docsid);
  //       return doc;
  //     },
  //     onError: (error) => console.log("Error getting documents: ", error),
  //   }
  // );
  function Logout() {
    localStorage.clear();
    window.location.href = "/";
   }
  return (
    <div>
      <div class="wrapper">
       {/*  <!-- Navbar --> */}
       <nav class="main-header navbar navbar-expand navbar-white navbar-light">
          {/*   <!-- Left navbar links --> */}
          <ul class="navbar-nav">
          <li class="nav-items logout-btn nav-logout-mobile">
            <h6 class="nav-link-custom  mx-auto" onClick={Logout}  >Logout</h6>
            </li>

          </ul>



          {/* <!-- Right navbar links --> */}
          <ul class="navbar-nav ml-auto">
            {/* <!-- Messages Dropdown Menu --> */}

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
           
           
            <li class="nav-item nav-item-mobile">
              <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fas fa-bars"></i>
              </a>
            </li>
            <li class="nav-items logout-btn nav-logout-desk">
            <a class="nav-link-custom  mx-auto" onClick={()=> {window.location.href="/"}} >Logout</a>
            </li>
          </ul>
        </nav>
        {/*  <!-- /.navbar --> */}


        <aside
          class="main-sidebar sidebar-dark-primary elevation-4"
          style={{ background: "#EDCBBD " }}
        >
          {/* <!-- Brand Logo --> */}
          <a href="/" class="brand-link">
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
              <div
                class="image"
                style={{
                  display: "flex",
                  paddingLeft: "0.8rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={localStorage.getItem("profilepic")}
                  class="img-circle elevation-2"
                  alt="Profile"
                  style={{ width: "2.1rem", height: "2.1rem" }}
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
                    <i class="nav-icon fa fa-list" aria-hidden="true"></i>
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
                    <i class="nav-icon fa fa-comments-o" aria-hidden="true"></i>

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
                   <i class="nav-icon fas fa-refresh"></i>
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
                    <i class=" nav-icon fa fa-users" aria-hidden="true"></i>
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
                   <i class=" nav-icon  fa fa-medium" aria-hidden="true"></i>

                    <p>Membership</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item mt-2">
                  <Link
                    // to={"/home"}
                    to={{pathname:"/home"}}
                    class="nav-link"
                    style={{ color: "black" }}
                    refresh="true"
                  >
                    {/* <i class="nav-icon fas fa-user"></i> */}
                    <a class="nav-link active  mx-auto" onClick={Logout}  >Logout</a>
                    {/* <button onClick={ refreshPage } variant="secondary" size="sm" className="nav-link active  mx-auto">Logout</button> */}

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
                    <MDBBadge color="danger" className="ml-2">
                      {inviteslength}
                    </MDBBadge>
                  </Link>
                </li> */}
              </ul>
            </nav>
            {/*  <!-- /.sidebar-menu --> */}
          </div>
          {/*  <!-- /.sidebar --> */}
        </aside>

        {/* <!-- Content Wrapper. Contains page content --> */}
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <section class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1>Match Making</h1>

                </div>
                <div class="col-sm-6">
                  <ol class="breadcrumb float-sm-right">
                    {/* <li class="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Find Match</li> */}
                  </ol>
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>

          <section class="content">
            <div class="row">
              <div class="col-md-2">
                <Link
                  to="/search"
                  type="button"
                  class="btn btn-block btn-danger"
                  style={{ margin: "20px 20px" }}
                >
                  Search
                </Link>
              </div>
            </div>
          </section>
          {/* <!-- Main content --> */}
          <section class="content">
            {/* <!-- Default box --> */}
            {/* <div class="card card-solid">
        <div class="card-body pb-0"> */}
            <div class="row d-flex align-items-stretch">
              <div class="d-flex align-items-stretch flex-wrap justify-content-center">
                {users_array != null ? (
                  users_array.length > 0 ? (
                    users_array.map((val) => {
                      return (
                        <div
                          class="card custom-card bg-light m-2"
                          style={{
                            // width: "23%",
                            height: "390px",
                            marginLeft: "2.5%",
                          }}
                        >
                          <div
                            class="card-header text-muted border-bottom-0"
                            style={{ textAlign: "center" }}
                          >
                            {val.email}
                          </div>
                          <div class="card-body pt-0">
                            <div class="row mt-2">
                              <div class="col-7">
                                <h2 class="lead p-1">
                                  <b>{val.data.profile.fullname}</b>
                                </h2>
                                <p class="text-muted text-sm text-center">
                                  <b>{val.data.profile.education} </b>
                                </p>
                              </div>
                              <div class="col-5 text-center">
                                <img
                                  src={val.data.profilepic || logo}
                                  alt=""
                                  class="img-circle img-fluid"
                                  style={{ height: "50px", width: "100px" }}
                                />
                              </div>
                              <div className="mt-3">
                                <ul class="ml-4 mb-0 fa-ul text-muted">
                                  <li>
                                    <span class="fa-li small">
                                      <i class="fas fa-lg fa-building"></i>
                                    </span>{" "}
                                    <span style={{ fontSize: "medium" }}>
                                      <span
                                        style={{
                                          color: "black",
                                          fontFamily: "sans-serif",
                                        }}
                                      >
                                        {" "}
                                        Address:
                                      </span>{" "}
                                      <span style={{ fontWeight: "600" }}>
                                        {" "}
                                        {val.data.profile.address}
                                      </span>
                                    </span>
                                  </li>
                                  <li class="mt-2">
                                    <span class="fa-li small">
                                      <i class="fas fa-lg fa-user-tie"></i>
                                    </span>{" "}
                                    <span
                                      style={{
                                        color: "black",
                                        fontFamily: "sans-serif",
                                      }}
                                    >
                                      {" "}
                                      Profession:
                                    </span>{" "}
                                    <span style={{ fontSize: "medium" }}>
                                      {val.data.profile.profession}
                                    </span>
                                  </li>
                                  <li class="mt-2">
                                    <span class="fa-li small">
                                      <i class="fas fa-lg fa-mosque"></i>
                                    </span>{" "}
                                    <span
                                      style={{
                                        color: "black",
                                        fontFamily: "sans-serif",
                                      }}
                                    >
                                      {" "}
                                      Religion:
                                    </span>{" "}
                                    <span style={{ fontSize: "medium" }}>
                                      {val.data.profile.sect}
                                    </span>
                                  </li>
                                  <li class="mt-2">
                                    <span class="fa-li small">
                                      <i class="fas fa-lg fa-ring"></i>
                                    </span>{" "}
                                    <span
                                      style={{
                                        color: "black",
                                        fontFamily: "sans-serif",
                                      }}
                                    >
                                      {" "}
                                      Marital Status:
                                    </span>{" "}
                                    <span style={{ fontSize: "medium" }}>
                                      {val.data.profile.martial}
                                    </span>
                                  </li>
                                </ul>
                              </div>

                              {/* {val.data.profilepic ?():()} */}
                            </div>
                          </div>
                          <div class="card-footer">
                            <div class="d-flex justify-content-between">

                                  {
                                       val.match > 30  ?<div class="progress-circle">
                                       <span class="title timerd" data-from="0" data-to="85" data-speed="1800">{val.match}%</span>

                                   </div> : <div class="progress-circle-green">
                                                      <span class="title timerd" data-from="0" data-to="85" data-speed="1800">{val.match}%</span>

                                                  </div>
                                  }
                              {/* <b className="pr-8">{val.match}%</b> */}

                              <Link
                                to={{
                                  pathname: "/otherprofile",
                                  query: { userid: val.userid },
                                }}
                                class="btn btn-sm btn-primary"
                                style={{ backgroundColor: "#ed225c" }}
                              >
                                <i class="fas fa-user"></i> View Profile
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      class="lds-heart"
                      style={{ position: "absolute", top: "50%", left: "50%" }}
                    >
                      <div></div>
                    </div>
                  )
                ) : (
                  <div
                    class="lds-heart"
                    style={{ position: "absolute", top: "50%", left: "50%" }}
                  >
                    <div></div>
                  </div>
                )}
              </div>
            </div>
            {/* </div> */}
            {/* <!-- /.card-body --> */}
            {/* <div class="card-footer">
              <nav aria-label="Find Matchs Page Navigation">
                <ul class="pagination justify-content-center m-0">
                  <li class="page-item active">
                    <a class="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      4
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      5
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      6
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      7
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      8
                    </a>
                  </li>
                </ul>
              </nav>
            </div> */}
            {/* <!-- /.card-footer --> */}
            {/* </div> */}
            {/* <!-- /.card --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
        {/* <!-- /.content-wrapper --> */}

       
        <footer class="main-footer text-center">
       <div class="">
            
            <h6 href="">Copyright &copy; 2021  Easyrishta All Right Reserved</h6>.
            </div>

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
