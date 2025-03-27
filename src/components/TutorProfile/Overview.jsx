import React, { useEffect, useState, useLayoutEffect } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import { ref, get, update } from "firebase/database";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

function Overview({ tutor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profilepic, setprofilepic] = useState(null);
  const [userData,setUserData] = useState(tutor || {name:"",email:"",profilepic:"",clas:"",exam:"",credits:0,bio:""});

  const {id} = useParams()

  useEffect(()=>{
    if(tutor){
      setUserData(tutor);
      // console.log(student)
    }
  },[tutor])

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedImage = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = (event) => setprofilepic(event.target.result);
      reader.readAsDataURL(compressedImage);
    } catch (error) {
      toast.error("Image compression failed!");
    }
  };

    // Update User Data in Firebase
    const handleSave = async () => {
      const userRef = ref(db, `tutors/${id}`);
      await update(userRef, userData);
              toast.success("User data updated successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
    };

  return (
    <div className="flex flex-col  md:mx-6">
      <div className="flex justify-end mb-2">
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md "
          onClick={() => {
            isEditing ? handleSave() : setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg px-6 font-semibold mb-4">Personal Information</h2>
          <div className="flex flex-col mb-4 w-full md:flex-row items-center md:space-x-4">
            <label>
              <input
                type="file"
                accept="image/*"
                readOnly={!isEditing}
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-36 h-36 mx-2 rounded-full overflow-hidden cursor-pointer border">
                <img
                  src={profilepic || userData?.profilepic || "/image.png"}
                  alt="Profile"
                />
              </div>
            </label>
            <div className="w-full px-4" >
              {/* Name */}
              <div className="flex-col space-y-2 mb-2" >
                <label className="text-gray-600">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={userData?.name}
                  disabled = {!isEditing}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Email */}
              <div className="flex-col space-y-2 mb-2" >
                <label className="text-gray-600">Email:</label>
                <input
                  type="text"
                  name="email"
                  value={userData?.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* parent? Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Parent's Information</h2>
          <p>
            <span className="font-medium">Father's Name: </span>
            <span className="font-medium">Contact: </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
