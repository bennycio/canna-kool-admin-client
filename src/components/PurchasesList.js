import React from "react";

const authShipping = async (selectedIds) => {
  if (
    window.confirm(
      "Are you sure you want to send off " +
        selectedIds.length +
        " purchases for shipment?"
    )
  ) {
    const url = process.env.REACT_APP_API_URL + "/authshipping";
    const data = {
      ids: [...selectedIds],
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (response.ok) alert("success");
    else alert("fail");
  }
};
