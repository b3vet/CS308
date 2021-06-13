import React, { useState, useEffect } from 'react';
import success from '../assets/icons/success.png'
import Button from 'react-bootstrap/Button'
function Success(props) {
    return (

        <div style={{ marginTop: 100, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        
            <img src={success}></img>
            <h1>Purchase Successful.<br /> You can track your order in your orders section in your profile.</h1>
            <Button onClick = {() => props.history.push("/dashboard/orders")}variant="dark" size="xl">Go to My Orders</Button>
        </div>
    );
                    
}


export default Success;
