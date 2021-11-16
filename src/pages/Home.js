// import react from "react";
import React from "react";
import { History } from "react-router-dom";
// import { db } from "../firestore";
/* import {BrowserRouter, Link, Switch} from 'react-router-dom'; */
import { Link } from "react-router-dom";
import preloader from "./../../src/pages/images/easyrishtapre.png";
import logo from "./../../src/pages/images/350x150-logo.png";
import crossIcon from "./images/cross-icons.png";
import logo3 from "./../../src/pages/images/web-banner5.png";
import avatar from "./../../src/pages/images/avatar5.png";
// import crossIcon from "./images/cross-icons.png";
// import OwlCarousel from "react-owl-carousel";
// import "owl.carousel/dist/assets/owl.carousel.css";
import "./home.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";
import { Modal, Button ,Form} from 'react-bootstrap';
import { auth, db } from "../../src/pages/firebase-config";
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loading: false,
      error: null,
      hidediv: false,
      LoginTab: false,
      isSidebarOpen: false,
      showRegisterModal : false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
    this.selectSection = this.selectSection.bind(this)
  }

  // handleRegisterClick = () => {
  //   this.setState({
  //      hidediv: true,
  //      LoginTab: true
  //    });
  //  }
  openModal() {

    this.setState({
      showModal: true,
    });
    //this.handleRegisterClick()
  }

  selectSection(){

    this.setState({
        showModal: true,
      });
  }
  closeModal() {
    this.setState({
      showModal: false,
      error: null,
    });
  }
  showModal = () => {
    this.setState({ show: true });
  };

  openRegisterModal() {
    this.setState({  showRegisterModal: true });
  }
  hideModal = () => {
    this.setState({ show: false });
  };

  // let modal = document.getElementById("myModal");

  // // Get the button that opens the modal
  // var btn = document.getElementById("myBtn");

  // // Get the <span> element that closes the modal
  // var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
   htmlModal = () => {

   this.setState({ isSidebarOpen: true });
  }
  registerModalClose = () => {
    this.setState({ isSidebarOpen: false });
  }

  // When the user clicks on <span> (x), close the modal
  // span.onclick = function() {
  //   modal.style.display = "none";
  // }

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // }




  async onLogin() {

    console.log("__onLogin__");
    console.log("email: " + document.querySelector("#email").value);
    console.log("password: " + document.querySelector("#password").value);
    // this.setState({ loading: true });

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    await auth.signInWithEmailAndPassword(email, password);
    console.log(auth.currentUser);
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {



        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // this.setState({ loading: false });
          console.log(doc.id, " => ", doc.data());
          localStorage.setItem("email", email);
          window.location.href = '/profile';
          // this.props.history.push({
          //   pathname: "/profile",
          //   //data: doc.data() // your data array of objects
          // });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    //  getprofile(email);
    if (!email || !password) {
      this.setState({
        error: true,
      });
    }
    //  else {
    //   this.onLoginSuccess("form");
    // }
  }
  onLoginSuccess(method, response) {
    console.log("logged successfully with " + method);
  }


  async onRegister() {
    console.log("__onRegister__");
    // console.log("login: " + document.querySelector("#login").value);
    console.log("email: " + document.querySelector("#email").value);
    console.log("password: " + document.querySelector("#password").value);

    // const login = document.querySelector("#login").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (!email || !password) {
      this.setState({
        error: true,
      });
    } else {
      //    ------------- Faizan's Code Start  -----------------
      ////////////// ---------------------   52PCT3d9zlT8FpAhourLZCsCmuB2

      await auth.createUserWithEmailAndPassword(email, password).then(async (res) => {
        let user = res.user;

        // await db.collection('users').doc(user.uid).delete();

        const userRef = db.doc(`users/${user.uid}`);

        // Go and fetch a document from that location.
        const snapshot = await userRef.get();

        // If there isn't a document for that user. Let's use information
        // that we got from either Google or our sign up form.
        if (!snapshot.exists) {
          const createdAt = new Date();
          const token = "ER-" + Math.floor(Math.random() * (100000 - 101) + 101);
          try {
            await userRef.set({
              email,
              password,
              plan: "basic",
              playerstatus: "available",
              registration_token: token,
              source: "custom",
              createdAt,
            });
            localStorage.setItem("email", email);
            localStorage.setItem("userid", user.uid);
            // this.props.history.push({
            //   pathname: "/register",
            // });
            window.location.href = '/register';
          } catch (error) {}
        }
        this.openModal();
        // veriry data

        db.collection("users")
          .doc(user.uid)
          .get()
          .then((querySnapshot) => {
            console.log({ VarifyData: querySnapshot });
          });
      });

      // Verify is ueser save or not

      //    ------------- Faizan Code End  -----------------

      // this.onLoginSuccess("form");
    }
  }

  onRecoverPassword() {
    console.log("__onFotgottenPassword__");
    console.log("email: " + document.querySelector("#email").value);

    const email = document.querySelector("#email").value;

    if (!email) {
      this.setState({
        error: true,
        recoverPasswordSuccess: false,
      });
    } else {
      this.setState({
        error: null,
        recoverPasswordSuccess: true,
      });
    }
  }


  onLoginFail(method, response) {
    console.log("logging failed with " + method);
    this.setState({
      error: response,
    });
  }

  startLoading() {
    this.setState({
      loading: true,
    });
  }

  finishLoading() {
    this.setState({
      loading: false,
    });
  }

  afterTabsChange() {
    this.setState({
      error: null,
    });
  }



  getprofile(email) {
    // db.collection("users").get((querysnapshot) => {
    //   const data = querysnapshot.docs.map((doc) => {
    //     doc.data();
    //   });
    //   console.log(data);
    //   this.setState({ users: data });
    // });
  }
  render() {
    const { isSidebarOpen } = this.state;
    const mystyle = {
      color: "black",
      backgroundColor: "#006600",
      // padding: "10px",
      // fontFamily: "Arial"
    };
    // const { users } = this.state;
    return (
      <div>
        <div id="preloader">
          <div class="clear-loading loading-effect">
            <img src={preloader} alt="Preloader" />
          </div>
        </div>
        <header id="header" class="dark">
          {/* <!--=================================
 mega menu --> */}

          <div>
            {/* <!-- menu start --> */}
            <nav id="menu" class="mega-menu">
              {/* <!-- menu list items container --> */}
              <section class="menu-list-items">
                <div class="container ">
                  <div class="row ">
                    <div class="col-md-12">
                      {/* <!-- menu logo --> */}
                      <ul class="menu-logo">
                        <li>
                          <a href="/">
                            <img src={logo} alt="Logo" style={{ maxHeight: "100px" }} />
                          </a>
                        </li>
                      </ul>
                      {/* <!-- menu links --> */}
                      {/* <Modal show={this.state.show} handleClose={this.hideModal}>
                        <p>Modal</p>
                      </Modal> */}
                      <ul class="menu-links">
                        {/* <!-- active class --> */}

                        <li>
                          <button
                            onClick={this.htmlModal}
                            style={mystyle}
                            class="registerMenuButton button btn-lg btn-colored full-rounded "
                            style={{
                              color: "white",
                              backgroundColor: "#D96C94",
                            }}
                          >
                            Register
                          </button>
                        </li>



                          <li>
                            <button
                            //   onClick={this.openModal}
                            onClick={this.openModal}
                              // style={mystyle}
                              className="loginMenuButton button btn-lg btn-colored full-rounded "
                              style={{
                                color: "white",
                                backgroundColor: "#D96C94",
                              }}
                            >
                              Login
                            </button>
                            {/* <input type="button" onClick={()=> console.log("input button clicked")}/> */}

                          </li>
                          {/* <li><button onClick={()=>alert("That is")}>Click Me!</button></li>
                          <p id="demo" onClick={this.selectSection}>Click me to change my text color.</p> */}
                      </ul>

                    </div>
                  </div>
                </div>
              </section>
            </nav>
            {/* <!-- menu end --> */}
          </div>
        </header>



        {/*
  <!--=================================
 header -->

  <!--================================= */}
        {/* banner --> */}
        <section id="home-slider" class="fullscreen" style={{ height: "auto" }}>
          <div id="kb" class="carousel kb_elastic animate_text kb_wrapper" data-ride="carousel" data-interval="6000" data-pause="hover">


            {/* <!--======= Wrapper for Slides =======--> */}
            <div class="carousel-inner" role="listbox">
              {/* <!--========= First Slide =========--> */}
              <div class="carousel-item item active non-animated">
                <img class="non-animated" src={logo3} alt="slider 01" />
              </div>


            </div>


          </div>
          {/* <!-- ++++++++++++++++++++++ END BOOTSTRAP CAROUSEL +++++++++++++++++++++++ --> */}
        </section>
        ;
        {/* <!--=================================
 banner -->

  <!--=================================
 Page Section --> */}
        {localStorage.getItem("username") != null ? (
          <section style={mystyle} class="form-1 py-3 carousel-form wow fadeInLeft" data-wow-delay="2.4s">

            <div class="container-fluid" style={{ padding: "0px,35px", maxWidth: 1000 }}>
              <div class="banner-form">
                <div class="row">
                  <div class="col-xl-2 col-lg-6">
                    <div class="form-group row">
                      <div class="col-lg-12">
                        <label class="control-label text-white">Looking For:</label>
                        <select tabindex="-98" className="form-control">
                          <option value="Choose One">Choose One</option>
                          <option value="Groom">Groom</option>
                          <option value="Bride"> Bride</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-2 col-lg-6">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group row">
                          <div class="col-lg-12">
                            <label class="control-label text-white">Age From:</label>
                          </div>
                          <div class="col-lg-12">
                            <select className="form-control">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                              <option>6</option>
                              <option>7</option>
                              <option>8</option>
                              <option>9</option>
                              <option>10</option>
                              <option>11</option>
                              <option>12</option>
                              <option>13</option>
                              <option>14</option>
                              <option>15</option>
                              <option>16</option>
                              <option>17</option>
                              <option>18</option>
                              <option>19</option>
                              <option>20</option>
                              <option>21</option>
                              <option>22</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group row">
                          <div class="col-lg-12 ">
                            <label class="control-label text-white pl-0">Age To:</label>
                          </div>
                          <div class="col-lg-12">
                            <select className="form-control">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                              <option>6</option>
                              <option>7</option>
                              <option>8</option>
                              <option>9</option>
                              <option>10</option>
                              <option>11</option>
                              <option>12</option>
                              <option>13</option>
                              <option>14</option>
                              <option>15</option>
                              <option>16</option>
                              <option>17</option>
                              <option>18</option>
                              <option>19</option>
                              <option>20</option>
                              <option>21</option>
                              <option>22</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-2 col-lg-6">
                    <div class="form-group row">
                      <div class="col-lg-12">
                        <label class="control-label text-white">Religion:</label>
                      </div>
                      <div class="col-lg-12">
                        <select className="form-control">
                          <option value="Choose One">Choose One</option>
                          <option value="Groom">Islam</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-2 col-lg-6">
                    <div class="form-group row">
                      <div class="col-lg-12">
                        <label class="control-label text-white pl-2">Mother Tongue:</label>
                        <div class="col-lg-12">
                          <select class="form-control">
                            <option value="2">Amharic</option>
                            <option value="3">Arabic</option>
                            <option value="4">Assamese</option>
                            <option value="5">Awadhi</option>
                            <option value="6">Azerbaijani</option>
                            <option value="7">Balochi</option>
                            <option value="8">Belarusian</option>
                            <option value="9">Bengali (Bangla)</option>
                            <option value="10">Bhojpuri</option>
                            <option value="11">Burmese</option>
                            <option value="12">Cebuano (Visayan)</option>
                            <option value="13">Chewa</option>
                            <option value="14">Chhattisgarhi</option>
                            <option value="15">Chittagonian</option>
                            <option value="16">Czech</option>
                            <option value="17">Deccan</option>
                            <option value="18">Dhundhari</option>
                            <option value="19">Dutch</option>
                            <option value="20">Eastern Min</option>
                            <option value="21">English</option>
                            <option value="22">French</option>
                            <option value="23">Fula</option>
                            <option value="24">Gan</option>
                            <option value="25">German</option>
                            <option value="26">Greek</option>
                            <option value="27">Gujarati</option>
                            <option value="28">Haitian Creole</option>
                            <option value="29">Hakka</option>
                            <option value="30">Haryanvi</option>
                            <option value="31">Hausa</option>
                            <option value="32">Hiligaynon/Ilonggo (Visayan)</option>
                            <option value="33">Hindi</option>
                            <option value="34">Hmong</option>
                            <option value="35">Hungarian</option>
                            <option value="36">Igbo</option>
                            <option value="37">Ilocano</option>
                            <option value="38">Italian</option>
                            <option value="39">Japanese</option>
                            <option value="40">Javanese</option>
                            <option value="41">Jin</option>
                            <option value="42">Kannada</option>
                            <option value="43">Kazakh</option>
                            <option value="44">Khmer</option>
                            <option value="45">Kinyarwanda</option>
                            <option value="46">Kirundi</option>
                            <option value="47">Konkani</option>
                            <option value="48">Korean</option>
                            <option value="49">Kurdish</option>
                            <option value="50">Madurese</option>
                            <option value="51">Magahi</option>
                            <option value="52">Maithili</option>
                            <option value="53">Malagasy</option>
                            <option value="54">Malay</option>
                            <option value="55">Malayalam</option>
                            <option value="56">Mandarin (entire branch)</option>
                            <option value="57">Marathi</option>
                            <option value="58">Marwari</option>
                            <option value="59">Mossi</option>
                            <option value="60">Nepali</option>
                            <option value="61">Odia (Oriya)</option>
                            <option value="62">Oromo</option>
                            <option value="63">Pashto</option>
                            <option value="64">Persian</option>
                            <option value="65">Polish</option>
                            <option value="66">Portuguese</option>
                            <option value="67">Punjabi</option>
                            <option value="68">Quechua</option>
                            <option value="69">Romanian</option>
                            <option value="70">Russian</option>
                            <option value="71">Saraiki</option>
                            <option value="72">Serbo-Croatian</option>
                            <option value="73">Shona</option>
                            <option value="74">Sindhi</option>
                            <option value="75">Sinhalese</option>
                            <option value="76">Somali</option>
                            <option value="77">Spanish</option>
                            <option value="78">Sundanese</option>
                            <option value="79">Swedish</option>
                            <option value="80">Sylheti</option>
                            <option value="81">Tagalog (Filipino)</option>
                            <option value="82">Tamil</option>
                            <option value="83">Telugu</option>
                            <option value="84">Thai</option>
                            <option value="85">Turkish</option>
                            <option value="86">Turkmen</option>
                            <option value="87">Ukrainian</option>
                            <option value="88">Urdu</option>
                            <option value="89">Uyghur</option>
                            <option value="90">Uzbek</option>
                            <option value="91">Vietnamese</option>
                            <option value="92">Wu (Shanghainese)</option>
                            <option value="93">Xhosa</option>
                            <option value="94">Xiang</option>
                            <option value="95">Yoruba</option>
                            <option value="96">Yue (Cantonese)</option>
                            <option value="97">Zhuang</option>
                            <option value="98">Zulu</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-2 col-lg-6">
                    <div class="form-group row">
                      <div class="col-lg-12">
                        <label class="control-label text-white pl-2">Country:</label>
                        <div class="col-lg-12">
                          <select class="form-control">
                            <option value="2">Albania</option>
                            <option value="3">Algeria</option>
                            <option value="4">American Samoa</option>
                            <option value="5">Andorra</option>
                            <option value="6">Angola</option>
                            <option value="7">Anguilla</option>
                            <option value="8">Antarctica</option>
                            <option value="9">Antigua And Barbuda</option>
                            <option value="10">Argentina</option>
                            <option value="11">Armenia</option>
                            <option value="12">Aruba</option>
                            <option value="13">Australia</option>
                            <option value="14">Austria</option>
                            <option value="15">Azerbaijan</option>
                            <option value="16">Bahamas The</option>
                            <option value="17">Bahrain</option>
                            <option value="18">Bangladesh</option>
                            <option value="19">Barbados</option>
                            <option value="20">Belarus</option>
                            <option value="21">Belgium</option>
                            <option value="22">Belize</option>
                            <option value="23">Benin</option>
                            <option value="24">Bermuda</option>
                            <option value="25">Bhutan</option>
                            <option value="26">Bolivia</option>
                            <option value="27">Bosnia and Herzegovina</option>
                            <option value="28">Botswana</option>
                            <option value="29">Bouvet Island</option>
                            <option value="30">Brazil</option>
                            <option value="31">British Indian Ocean Territory</option>
                            <option value="32">Brunei</option>
                            <option value="33">Bulgaria</option>
                            <option value="34">Burkina Faso</option>
                            <option value="35">Burundi</option>
                            <option value="36">Cambodia</option>
                            <option value="37">Cameroon</option>
                            <option value="38">Canada</option>
                            <option value="39">Cape Verde</option>
                            <option value="40">Cayman Islands</option>
                            <option value="41">Central African Republic</option>
                            <option value="42">Chad</option>
                            <option value="43">Chile</option>
                            <option value="44">China</option>
                            <option value="45">Christmas Island</option>
                            <option value="46">Cocos (Keeling) Islands</option>
                            <option value="47">Colombia</option>
                            <option value="48">Comoros</option>
                            <option value="49">Republic Of The Congo</option>
                            <option value="50">Democratic Republic Of The Congo</option>
                            <option value="51">Cook Islands</option>
                            <option value="52">Costa Rica</option>
                            <option value="53">Cote D Ivoire (Ivory Coast)</option>
                            <option value="54">Croatia (Hrvatska)</option>
                            <option value="55">Cuba</option>
                            <option value="56">Cyprus</option>
                            <option value="57">Czech Republic</option>
                            <option value="58">Denmark</option>
                            <option value="59">Djibouti</option>
                            <option value="60">Dominica</option>
                            <option value="61">Dominican Republic</option>
                            <option value="62">East Timor</option>
                            <option value="63">Ecuador</option>
                            <option value="64">Egypt</option>
                            <option value="65">El Salvador</option>
                            <option value="66">Equatorial Guinea</option>
                            <option value="67">Eritrea</option>
                            <option value="68">Estonia</option>
                            <option value="69">Ethiopia</option>
                            <option value="70">External Territories of Australia</option>
                            <option value="71">Falkland Islands</option>
                            <option value="72">Faroe Islands</option>
                            <option value="73">Fiji Islands</option>
                            <option value="74">Finland</option>
                            <option value="75">France</option>
                            <option value="76">French Guiana</option>
                            <option value="77">French Polynesia</option>
                            <option value="78">French Southern Territories</option>
                            <option value="79">Gabon</option>
                            <option value="80">Gambia The</option>
                            <option value="81">Georgia</option>
                            <option value="82">Germany</option>
                            <option value="83">Ghana</option>
                            <option value="84">Gibraltar</option>
                            <option value="85">Greece</option>
                            <option value="86">Greenland</option>
                            <option value="87">Grenada</option>
                            <option value="88">Guadeloupe</option>
                            <option value="89">Guam</option>
                            <option value="90">Guatemala</option>
                            <option value="91">Guernsey and Alderney</option>
                            <option value="92">Guinea</option>
                            <option value="93">Guinea-Bissau</option>
                            <option value="94">Guyana</option>
                            <option value="95">Haiti</option>
                            <option value="96">Heard and McDonald Islands</option>
                            <option value="97">Honduras</option>
                            <option value="98">Hong Kong S.A.R.</option>
                            <option value="99">Hungary</option>
                            <option value="100">Iceland</option>
                            <option value="101">India</option>
                            <option value="102">Indonesia</option>
                            <option value="103">Iran</option>
                            <option value="104">Iraq</option>
                            <option value="105">Ireland</option>
                            <option value="106">Israel</option>
                            <option value="107">Italy</option>
                            <option value="108">Jamaica</option>
                            <option value="109">Japan</option>
                            <option value="110">Jersey</option>
                            <option value="111">Jordan</option>
                            <option value="112">Kazakhstan</option>
                            <option value="113">Kenya</option>
                            <option value="114">Kiribati</option>
                            <option value="115">Korea North</option>
                            <option value="116">Korea South</option>
                            <option value="117">Kuwait</option>
                            <option value="118">Kyrgyzstan</option>
                            <option value="119">Laos</option>
                            <option value="120">Latvia</option>
                            <option value="121">Lebanon</option>
                            <option value="122">Lesotho</option>
                            <option value="123">Liberia</option>
                            <option value="124">Libya</option>
                            <option value="125">Liechtenstein</option>
                            <option value="126">Lithuania</option>
                            <option value="127">Luxembourg</option>
                            <option value="128">Macau S.A.R.</option>
                            <option value="129">Macedonia</option>
                            <option value="130">Madagascar</option>
                            <option value="131">Malawi</option>
                            <option value="132">Malaysia</option>
                            <option value="133">Maldives</option>
                            <option value="134">Mali</option>
                            <option value="135">Malta</option>
                            <option value="136">Man (Isle of)</option>
                            <option value="137">Marshall Islands</option>
                            <option value="138">Martinique</option>
                            <option value="139">Mauritania</option>
                            <option value="140">Mauritius</option>
                            <option value="141">Mayotte</option>
                            <option value="142">Mexico</option>
                            <option value="143">Micronesia</option>
                            <option value="144">Moldova</option>
                            <option value="145">Monaco</option>
                            <option value="146">Mongolia</option>
                            <option value="147">Montserrat</option>
                            <option value="148">Morocco</option>
                            <option value="149">Mozambique</option>
                            <option value="150">Myanmar</option>
                            <option value="151">Namibia</option>
                            <option value="152">Nauru</option>
                            <option value="153">Nepal</option>
                            <option value="154">Netherlands Antilles</option>
                            <option value="155">Netherlands The</option>
                            <option value="156">New Caledonia</option>
                            <option value="157">New Zealand</option>
                            <option value="158">Nicaragua</option>
                            <option value="159">Niger</option>
                            <option value="160">Nigeria</option>
                            <option value="161">Niue</option>
                            <option value="162">Norfolk Island</option>
                            <option value="163">Northern Mariana Islands</option>
                            <option value="164">Norway</option>
                            <option value="165">Oman</option>
                            <option value="166">Pakistan</option>
                            <option value="167">Palau</option>
                            <option value="168">Palestinian Territory Occupied</option>
                            <option value="169">Panama</option>
                            <option value="170">Papua new Guinea</option>
                            <option value="171">Paraguay</option>
                            <option value="172">Peru</option>
                            <option value="173">Philippines</option>
                            <option value="174">Pitcairn Island</option>
                            <option value="175">Poland</option>
                            <option value="176">Portugal</option>
                            <option value="177">Puerto Rico</option>
                            <option value="178">Qatar</option>
                            <option value="179">Reunion</option>
                            <option value="180">Romania</option>
                            <option value="181">Russia</option>
                            <option value="182">Rwanda</option>
                            <option value="183">Saint Helena</option>
                            <option value="184">Saint Kitts And Nevis</option>
                            <option value="185">Saint Lucia</option>
                            <option value="186">Saint Pierre and Miquelon</option>
                            <option value="187">Saint Vincent And The Grenadines</option>
                            <option value="188">Samoa</option>
                            <option value="189">San Marino</option>
                            <option value="190">Sao Tome and Principe</option>
                            <option value="191">Saudi Arabia</option>
                            <option value="192">Senegal</option>
                            <option value="193">Serbia</option>
                            <option value="194">Seychelles</option>
                            <option value="195">Sierra Leone</option>
                            <option value="196">Singapore</option>
                            <option value="197">Slovakia</option>
                            <option value="198">Slovenia</option>
                            <option value="199">Smaller Territories of the UK</option>
                            <option value="200">Solomon Islands</option>
                            <option value="201">Somalia</option>
                            <option value="202">South Africa</option>
                            <option value="203">South Georgia</option>
                            <option value="204">South Sudan</option>
                            <option value="205">Spain</option>
                            <option value="206">Sri Lanka</option>
                            <option value="207">Sudan</option>
                            <option value="208">Suriname</option>
                            <option value="209">Svalbard And Jan Mayen Islands</option>
                            <option value="210">Swaziland</option>
                            <option value="211">Sweden</option>
                            <option value="212">Switzerland</option>
                            <option value="213">Syria</option>
                            <option value="214">Taiwan</option>
                            <option value="215">Tajikistan</option>
                            <option value="216">Tanzania</option>
                            <option value="217">Thailand</option>
                            <option value="218">Togo</option>
                            <option value="219">Tokelau</option>
                            <option value="220">Tonga</option>
                            <option value="221">Trinidad And Tobago</option>
                            <option value="222">Tunisia</option>
                            <option value="223">Turkey</option>
                            <option value="224">Turkmenistan</option>
                            <option value="225">Turks And Caicos Islands</option>
                            <option value="226">Tuvalu</option>
                            <option value="227">Uganda</option>
                            <option value="228">Ukraine</option>
                            <option value="229">United Arab Emirates</option>
                            <option value="230">United Kingdom</option>
                            <option value="231">United States</option>
                            <option value="232">United States Minor Outlying Islands</option>
                            <option value="233">Uruguay</option>
                            <option value="234">Uzbekistan</option>
                            <option value="235">Vanuatu</option>
                            <option value="236">Vatican City State (Holy See)</option>
                            <option value="237">Venezuela</option>
                            <option value="238">Vietnam</option>
                            <option value="239">Virgin Islands (British)</option>
                            <option value="240">Virgin Islands (US)</option>
                            <option value="241">Wallis And Futuna Islands</option>
                            <option value="242">Western Sahara</option>
                            <option value="243">Yemen</option>
                            <option value="244">Yugoslavia</option>
                            <option value="245">Zambia</option>
                            <option value="246">Zimbabwe</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-2">
                    <a href="/search" class="button btn-colored full-rounded animated right-icn" style={{ marginTop: 20 }}>
                      <span class="text-white">
                        search <i class="glyph-icon flaticon-hearts" aria-hidden="true"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        <section class="page-section-ptb text-center wow fadeInLeft" data-wow-delay=".1s" data-wow-offset="200" style={{ backgroundColor: "white" }}>
          <div class="container">
            <div class="row justify-content-center mb-5 sm-mb-3">
              <div class="col-md-8">
                <h2 class="title divider-2 mb-3" style={{ color: "#00bcd5" }}>
                  Steps To Find Your Soulmate
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 sm-mb-3">
                <div class="timeline-badge mb-2">
                  <img class="img-center img-icon" src="../../assets/images/icons/Sign-Up.png" alt="" />
                </div>
                <h4 class="title divider-3 mb-3" style={{ color: "#00bcd5" }}>
                  CREATE PROFILE
                </h4>
                <p style={{ color: "black" }}>Create your profile by entering all the details. The better you set up your profile, the more chances of you to match most relevant profile.</p>
              </div>
              <div class="col-md-4 sm-mb-3">
                <div class="timeline-badge mb-2">
                  {/* <!-- <img class="img-center img-icon" src="images/icons/matching.png" alt=""> --> */}
                  <img class="img-center img-icon" src="../../assets/images/icons/best-match.png" alt="" />
                </div>
                <h4 class="title divider-3 mb-3" style={{ color: "#00bcd5" }}>
                  PERFECT MATCH
                </h4>
                <p style={{ color: "black" }}>Our website uses an algorithm to match you with the profile having most similarities to your profile. Whatever you requirements are, we make sure to match you with nothing but the best.</p>
              </div>
              <div class="col-md-4">
                <div class="timeline-badge mb-2">
                  {/* <!-- <img class="img-center img-icon" src="images/icons/trust.png" alt=""> --> */}
                  <img class="img-center img-icon" src="../../assets/images/icons/trusted.png" alt="" />
                </div>
                <h4 class="title divider-3 mb-3" style={{ color: "#00bcd5" }}>
                  GET MARRIED
                </h4>
                <p style={{ color: "black" }}>Become a premium member to get the contact information of the profiles you like. Escalate things further leading towards the path designed for you, your marriage!</p>
              </div>
            </div>
          </div>
        </section>




        <section style={{ height: 650 }}>
          <div className="row">
            <div
              className="col-12 font-weight-bolder size-50 text-center mt-5 mb-5"
              style={{
                fontFamily: "cursive",
                fontSize: "xx-large",
                color: "#ed2d93",
              }}
            >
              Introducing Easy Rishta App
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div>
                <img class="img-fluid" src="../../assets/images/story/website-add.png" alt="" />
              </div>
            </div>
            <div className="col-6">
              <div>
                <img class="img-fluid" src="../../assets/images/story/blue.png" alt="" />
              </div>
              <div
                className="ml-xl-n4 mt-5"
                style={{
                  fontSize: "xx-large",
                  fontFamily: "Montserrat",
                  fontWeight: "500",
                }}
              >
                Now Meet Your Best Matches
              </div>
              <div>
                <div className="ml-5 mt-5">
                  <img class="img-fluid" src="../../assets/images/story/lineborder.png" alt="" />
                </div>
              </div>
              <div
                className="ml-4"
                style={{
                  fontSize: "xx-large",
                  fontFamily: "Montserrat",
                  fontWeight: "500",
                  color: "#ed2d93",
                }}
              >
                Available On Play Store
              </div>
              <div>
                <div style={{ marginLeft: "9%" }}>
                  <img class="img-fluid" src="../../assets/images/story/badge.png" alt="" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section>
          <div
            class="container"
            style={{
              backgroundImage: "url(../../assets/images/appbanner.jpeg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "860px",
              maxWidth: "100%",
            }}
          ></div>
        </section> */}
        {/* <div
          style={{
            backgroundImage:
              "url(../../assets/images/appbanner.jpeg) no-repeat 0 0",
          }}
        ></div> */}
        {/* <!-- background: url(images/bg/bg-3.jpg) --> */}
        <section
          class="page-section-ptb bg-overlay-black-60 text-white"
          style={{
            background: "url(../../assets/images/inner-Banners/14.jpg) no-repeat 0 0",
            backgroundSize: "cover",
            position: "relative",
          }}
        >
          <div class="container wow pulse" data-wow-delay=".3s" data-wow-offset="100">
            <div class="row justify-content-center mb-5 sm-mb-3">
              <div class="col-md-8 text-center">
                <h2 class="title divider " style={{ color: "#00bcd5" }}>
                  Most trusted Matrimonial Website
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <h4 class="title text-center ">With our tons of professionals working day and night we assure you, you’re in safe hands at the best matrimonial website Easyrishta for your best match.</h4>
              </div>
            </div>
          </div>
        </section>

  {/* <!--================================= ---Reviews Section --> */}



  <div className="custom-container">
    <div id="demo" className="carousel slide" data-ride="carousel">
    <div class="row justify-content-center">
                <div class="col-md-8 text-center">
                  <h2 class="title divider-2" style={{ color: "#00bcd5" }}>
                    Success Stories
                  </h2>
                  <p class="lead m-0">The stories of love that started right at our Easyrishta.</p>
                </div>
              </div>
        <div className="carousel-inner">
            <div className="carousel-item active">
                <div className="carousel-caption">
                    <p>If Shai Reznik's TDD videos don't convince you to add automated testing your code, I don't know what will.This was the very best explanation of frameworks for brginners that I've ever seen. </p>
                     <img src={avatar} alt="" />
                    <div id="image-caption">Nick Doe</div>
                </div>
            </div>
            <div className="carousel-item">
                <div className="carousel-caption">
                    <p>If Shai Reznik's TDD videos don't convince you to add automated testing your code, I don't know what will.This was the very best explanation of frameworks for brginners that I've ever seen.</p>
                    <img src={avatar} alt="" className="img-fluid" />
                    <div id="image-caption">Cromption Greves</div>
                </div>
            </div>
            <div className="carousel-item">
                <div className="carousel-caption">
                    <p>If Shai Reznik's TDD videos don't convince you to add automated testing your code, I don't know what will.This was the very best explanation of frameworks for brginners that I've ever seen.</p>
                    <img src={avatar} alt="" className="img-fluid" />
                    <div id="image-caption">Harry Mon</div>
                </div>
            </div>
        </div> <a className="carousel-control-prev" href="#demo" data-slide="prev"> <i className='fas fa-arrow-left fa-arrow-left-custom'></i> </a> <a className="carousel-control-next" href="#demo" data-slide="next"> <i className='fas fa-arrow-right fa-arrow-right-custom'></i> </a>
    </div>
     </div>
        {/* <!--================================= ---Reviews Section --> */}













        <section
          class="page-section pt-4 pb-4 bg fixed page-section--ps bg-overlay-black-50 text-white"
          style={{
            backgroundImage: "url(../../assets/images/bg/Personal-Service-BG.jpg)",
          }}
        >
          <div class="container">
            <div class="row justify-content-center mb-1 sm-mb-3">
              <div class="col-md-8 text-center">
                <h2 class="title divider wow fadeInLeft" style={{ color: "#00bcd5" }}>
                  Personalized Services
                </h2>
                <h5 class="text-center mt-4"> Personalized matchmaking services Easyrishta.com provides you.</h5>
              </div>
            </div>
            {/* </div> */}

            <div class="row mt-7 mb-6">
              <div class="col-lg-4 col-md-6 text-center">
                <div class="ss-box  wow fadeInLeft" data-wow-delay="0.2s" data-wow-offset="100">
                  <div class="timeline-badge">
                    <img class="img-center" src="../../assets/images/icons/advisor.png" alt="" />
                  </div>
                  <h4 class="title divider-3 mb-3">Personal Advisor</h4>
                  <p>Here at easy Rishta, we provide a personal advisor to you to help you find an appropriate match.
                     Our advisor makes sure to arrange proposals keeping in mind your specific wants and needs.
                      There will be no more wasted time and no more uncomfortable or awkward meetings anymore.
                      Your personal advisor has you covered for finding a perfect match!</p>
                </div>
              </div>

              <div class="col-lg-4 col-md-6 text-center">
                <div class="ss-box  wow fadeInLeft" data-wow-delay="0.7s" data-wow-offset="100">
                  <div class="timeline-badge">
                    <img class="img-center" src="../../assets/images/icons/personal-matchmaking.png" alt="" />
                  </div>
                  <h4 class="title divider-3 mb-3">Personal matchmaking </h4>
<p>Easy Rishta intends to provide you with a variety of options when it comes to finding a life companion. We urge you to browse through the largest list of candidates seeking Pakistani matches for marriage, whether you are enrolling for yourself or on behalf of your children/siblings. We’ve also given those who want to marry, the power to make their own decisions. </p>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 text-center">
                <div class="ss-box  wow fadeInLeft" data-wow-delay="1.1s" data-wow-offset="100">
                  <div class="timeline-badge">
                    <img class="img-center" src="../../assets/images/icons/arrange-meeting.png" alt="" />
                  </div>
                  <h4 class="title divider-3 mb-3">Intro And Meeting</h4>
<p>
Get yourself registered with our system, either online or by visiting our office. Once you get registered, you can reach out to your favorite profile and chat by sending a request. Easy Rishta platform also helps arrange meetings with the proposal of your choice. </p>
                </div>
              </div>
            </div>

            {/* </div>       */}


          </div>
        </section>

        {/* <!--================================= Foote-Start --> */}
        <footer
          class="page-section-pt contact-section text-center"
          style={{
            backgroundColor: "white",
            backgroundSize: "cover",
          }}
        >
          <div class="container wow fadeInUp" data-wow-delay=".2s" data-wow-offset="200">
            <div class="row justify-content-center ">
              <div class="col-md-10">
                <div class="row mb-5">
                  <div class="col-md-12">
                    <h2 class="title divider mb-3" style={{ color: "#00bcd5" }}>
                      Contact Us
                    </h2>
                    <p class="lead" style={{ color: "black" }}>
                      Contact the best matrimonial website ¬for any queries, issues or concerns you have.
                    </p>
                  </div>
                </div>
                <div class="row mb-5 sm-mb-2">
                  <div class="col-md-4">
                    <div class="address-block">
                      <i class="fa fa-desktop" aria-hidden="true"></i>
                      <a href="mailto:info@Easyrishta.com " style={{ color: "black" }}>
                        info@easyrishta.com
                      </a>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="address-block">
                      <i class="fa fa-home" aria-hidden="true"></i>
                      <a href="www.google.com" style={{ color: "black" }}>
                        EasyRishta, 369 D, Street 17 <br />
                        PWD Housing Society, Islamabad
                      </a>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="address-block">
                      <i class="fa fa-phone" aria-hidden="true"></i>
                      <a href="tel:+923111 222 541" style={{ color: "black" }}>
                        +92 331 338 7710
                      </a>
                    </div>
                  </div>
                </div>


              </div>
            </div>

          </div>
          <div class="footer-widget sm-mt-3">
            <div
              class="footer-middle"
              style={{
                background: "url(../../assets/images/pattern/01.png) no-repeat 0 0",
                backgroundSize: "cover",
              }}
            >
              <div class="container wow fadeIn" data-wow-offset="50">
                <div class="row">
                  <div class="col-lg-2 offset-lg-1 col-sm-12">

                    <div class="footer-pad">
                      <h4 style={{ color: "#ed225c" }}>Company</h4>
                      <ul class="list-unstyled">
                        <li>
                          <Link to={"/"} style={{ color: "white" }}>
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link to={"/About us"} style={{ color: "white" }}>
                            About Us
                          </Link>
                        </li>




                      </ul>
                    </div>
                  </div>

                  <div class="col-lg-2 col-sm-12">

                    <div class="footer-pad">
                      <h4 style={{ color: "#ed225c" }}>Policies</h4>
                      <ul class="list-unstyled">
                        <li>
                          <Link to={"/privacypolicy"} style={{ color: "white" }}>
                            Privacy and Policy
                          </Link>
                        </li>
                        <li>
                          <Link to={"/termscondition"} style={{ color: "white" }}>
                            Terms & Conditions
                          </Link>
                        </li>



                      </ul>
                    </div>
                  </div>

                  {/* <div class="col-lg-2 col-sm-12">

                    <div class="footer-pad">
                      <h4 style={{ color: "#ed225c" }}>Partner Services</h4>
                      <ul class="list-unstyled">
                        <li>
                          <a href="./partner.html" style={{ color: "white" }}>
                            Be Our Partner
                          </a>
                        </li>

                      </ul>
                    </div>
                  </div> */}

                  <div class="col-lg-2 col-sm-12">

                    <div class="footer-pad">
                      <h4 style={{ color: "#ed225c" }}>Help</h4>
                      <ul class="list-unstyled">

                        <li>
                          <Link to={"/Contact"} style={{ color: "white" }}>
                            Contact Us
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>


                  <div class="col-lg-2 col-sm-12">

                    <div class="footer-pad">
                      <h4 style={{ color: "#ed225c" }}>Contact Us</h4>

                      <div class="footer-logo mb-2" style={{ marginTop: "15px" }}>
                        <img style={{ maxWidth: "180px", maxHeight: "75px" }} src={logo} alt="Logo" />
                      </div>
                      <p style={{ color: "white" }}>
                      EasyRishta, 369 D, Street 17 <br />
                        PWD Housing Society, Islamabad
                      </p>

                      <div class="social-icons color-hover">
                        <ul>
                          <li class="social-facebook">
                            <a href="www.google.com">
                              <i class="fa fa-facebook"></i>
                            </a>
                          </li>
                          <li class="social-twitter">
                            <a href="www.google.com">
                              <i class="fa fa-twitter"></i>
                            </a>
                          </li>
                          <li class="social-dribbble">
                            <a href="www.google.com">
                              <i class="fa fa-dribbble"></i>
                            </a>
                          </li>
                          <li class="social-gplus">
                            <a href="www.google.com">
                              <i class="fa fa-google-plus"></i>
                            </a>
                          </li>
                          <li class="social-youtube">
                            <a href="www.google.com">
                              <i class="fa fa-youtube"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="container-fluid footer-bottom" style={{ backgroundColor: "#ed225c" }}>
              <div class="justify-content-center">
                <p class="text-white">© 2021 - Easyrishta All Right Reserved </p>
              </div>
            </div>
          </div>
        </footer>
          {/* <!--=================================  Footer-End  --> */}





{/* Html-modal */}
{/* Custom-modal */}

<Modal  show={this.state.showModal} >
        <Modal.Header >
        <Button variant="secondary"  size="lg" >Login </Button>

          <Button  variant="outline-light"  onClick={this.closeModal.bind(this)}>
           <img style={{width:"20px"}} src={crossIcon}></img>
          </Button>
        </Modal.Header>
        <div>

        </div>
        <Modal.Body>

        <Form>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" id="email" placeholder="Enter email" />

  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" id="password" placeholder="Password" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group>
  {/* onClick={this.onLogin.bind(this)} */}
  <Button  style={{backgroundColor:"#d96c94"}} type="button"   onClick={this.onLogin}>
    Submit
  </Button>
</Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={}>
            Close
            </Button>
          */}

        </Modal.Footer>
      </Modal>


{/* Custom-modal */}
{/* Custom-register-modal */}

<Modal  show={this.state.isSidebarOpen} >
        <Modal.Header >
          <Button variant="secondary" size="lg"  > Register</Button>
          <Button  variant="outline-light"  onClick={this.registerModalClose}>
           <img style={{width:"20px"}} src={crossIcon}></img>
          </Button>
        </Modal.Header>

        <Modal.Body>

        <Form>
  {/* <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Username</Form.Label>
    <Form.Control type="email" id="username" placeholder="Enter Username" />

  </Form.Group> */}
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" id="email" placeholder="Enter email" />

  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" id="password" placeholder="Password" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group>
  {/* onClick={this.onLogin.bind(this)} */}
  <Button style={{backgroundColor:"#d96c94"}} type="button"   onClick={this.onRegister}>
    Submit
  </Button>
</Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={}>
            Close
            </Button>
          */}

        </Modal.Footer>
      </Modal>


{/* Custom-modal */}

      </div>
    );
  }
}

export default Home;
