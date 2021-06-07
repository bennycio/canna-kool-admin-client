import { Box, Button, CheckBox, DataTable, Text } from "grommet"
import React, { useEffect, useState } from "react"
import { useList } from "react-use"

const authShipping = async selectedIds => {
  if (
    window.confirm(
      "Are you sure you want to send off " +
        selectedIds.length +
        " purchases for shipment?"
    )
  ) {
    const url = process.env.REACT_APP_API_URL + "/authshipping"
    const data = {
      ids: selectedIds,
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    if (response.ok) alert("success")
    else alert("fail")
  }
}

const PurchasesList = () => {
  const [data, setData] = useState([])
  const [selected, { push, removeAt }] = useList([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/purchases?limit=10&page=1`)
      .then(resp => resp.json())
      .then(json => {
        setData(json)
      })
  }, [setData])

  return (
    <Box align="center" fill="horizontal">
      <DataTable
        border
        pin
        background="light-2"
        columns={[
          {
            size: "xxsmall",
            render: datum => {
              return (
                <CheckBox
                  checked={selected.includes(datum.id)}
                  onChange={e => {
                    if (selected.includes(datum.id)) {
                      removeAt(selected.indexOf(datum.id))
                    } else {
                      push(datum.id)
                    }
                  }}
                />
              )
            },
          },
          {
            property: "id",
            header: <Text>Id</Text>,
            primary: true,
            size: "medium",
            search: true,
          },
          {
            property: "date",
            header: <Text>Date</Text>,
            primary: false,
            size: "xsmall",
            render: datum => {
              return <>{datum.date.substr(0, 10)}</>
            },
          },
          {
            property: "price",
            header: <Text>Price</Text>,
            primary: false,
            size: "xsmall",
            render: datum => {
              return <>${datum.price}</>
            },
          },
          {
            property: "address",
            header: <Text>Address</Text>,
            primary: false,
            size: "medium",
            search: true,
          },
        ]}
        data={data}
      />
      <Button
        onClick={() => authShipping(selected)}
        primary
        label="Mark As Shipped"
      />
    </Box>
  )
}

export default PurchasesList
