import React, { useState, useContext } from "react";
import Modal from "react-modal";

import { ProductContext } from "../../context/ProductContext";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useFirestore } from "../../hooks/useFirestore";
import { setMenuItem, deleteMenuItem } from "../../Utils/FirebaseUtils";
import ListUI from "../ListUI";
import TabsUI from "../TabsUI";
import UpdateMenuForm from "./Forms/UpdateMenuForm";
import MenuList from "./MenuList";

Modal.setAppElement("#__next");

const Products = () => {
  const {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    price,
    setPrice,
    quantity,
    setQuantity,
    updateData,
    setUpdateData,
    image,
    setImage,
    imageUrl,
    setImageUrl,
    imageTitle,
    setImageTitle,
  } = useContext(ProductContext);
  const { docs } = useFirestore("menuItems");
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgUrl = await handleFileUpload(image);
    setImageUrl(imgUrl);

    if (imgUrl) {
      const menuDetails = {
        Name: name,
        Description: description,
        Category: category,
        Price: price,
        Quantity: quantity,
        Image: imgUrl,
        ImageTitle: image.name,
        createdAt:
          Object.keys(updateData).length === 0
            ? new Date().getTime()
            : updateData.createdAt,
      };
      try {
        setMenuItem(
          menuDetails,
          Object.keys(updateData).length === 0 ? "newID" : updateData.id
        );
        clearField();
        setUpdateData({});
      } catch (error) {
        console.log("ERROR: ");
        console.log(error);
      }
    }
  };

  const handleUpdate = (data) => {
    setUpdateData(data);
    setName(data.Name);
    setDescription(data.Description);
    setCategory(data.Category);
    setPrice(data.Price);
    setQuantity(data.Quantity);
    setImage(data.Image);
    setImageTitle(data.ImageTitle);
    setModalOpen(true);
  };

  const handleFileUpload = async (myImage) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${myImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, myImage);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is " + progress.toString() + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused...");
              break;
            case "running":
              console.log("Upload is running...");
              break;
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImageUrl(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteItem = (data) => {
    const storage = getStorage();

    const desertRef = ref(storage, `images/${data.ImageTitle}`);

    deleteObject(desertRef)
      .then(() => {
        console.log(`Successfully deleted image ${data.ImageTitle}`);
        deleteMenuItem(data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseModal = () => {
    clearField();
    setModalOpen(false);
  };

  const clearField = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice(0);
    setQuantity(0);
    // setImage(null);
    setImage("");
    // setImageUrl("");
    setImageTitle("");
    setModalOpen(false);
    setProgress(0);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-5">
        <h1 className="text-xl text-gray-700 mb-4">Menu</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          ADD
        </button>
      </div>
      <MenuList
        menuItems={docs}
        handleUpdate={handleUpdate}
        handleDeleteItem={handleDeleteItem}
      />

      <Modal isOpen={modalOpen} onRequestClose={handleCloseModal}>
        <UpdateMenuForm
          progress={progress}
          onHandleSubmit={handleSubmit}
          onHandleUpdate={handleUpdate}
          // onHandleFileChange={handleFileChange}
        />
      </Modal>
    </div>
  );
};

export default Products;
