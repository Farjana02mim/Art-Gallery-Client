import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

const Artist = () => {
  const { register, handleSubmit } = useForm();
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let imageURL = "";

      // যদি file upload করা হয়
      if (data.image[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );

        imageURL = imgRes.data.data.url;
      }

      const artistInfo = {
        ...data,
        name: user?.displayName,
        email: user?.email,
        image: imageURL, // final image URL
        status: "pending",
        created_at: new Date(),
      };

      const res = await axiosSecure.post("/artists", artistInfo);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your artist request is pending approval",
        });

        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-5xl font-bold mb-8 text-center">Be An Artist</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <input
          {...register("name")}
          defaultValue={user?.displayName}
          className="input input-bordered w-full"
          placeholder="Artist Name"
        />

        {/* Email */}
        <input
          {...register("email")}
          defaultValue={user?.email}
          className="input input-bordered w-full"
          placeholder="Email"
        />

        {/* Title */}
        <input
          {...register("title")}
          className="input input-bordered w-full"
          placeholder="Artist Title (Painter, Digital Artist...)"
        />

        {/* Experience */}
        <input
          {...register("experience")}
          className="input input-bordered w-full"
          placeholder="Years of Experience"
        />

        {/* Portfolio */}
        <input
          {...register("portfolio")}
          className="input input-bordered w-full"
          placeholder="Portfolio Website Link"
        />

        {/* Image File */}
        <input
          {...register("image")}
          type="file"
          className="input input-bordered w-full"
        />

        {/* Bio */}
        <textarea
          {...register("bio")}
          className="textarea textarea-bordered w-full"
          placeholder="Short Biography"
        ></textarea>

        <button
          type="submit"
          className={`btn btn-primary w-full text-black ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply as Artist"}
        </button>
      </form>
    </div>
  );
};

export default Artist;