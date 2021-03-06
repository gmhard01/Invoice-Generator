import React, { useState } from 'react';
import '../css/InvoiceTemplate.css';

let lineItems = [];
let totalOfItems = [];

export default function InvoiceTemplate() {
    const today = new Date();
    const invDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    const [desc, setDesc] = useState("");
    const [qty, setQty] = useState(1);
    const [rate, setRate] = useState(0);
    const itemTotal = qty * rate;
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const invTotal = subTotal * (1+tax/100);

    function handleAdd(e) {
        e.preventDefault();

        let item = {
            desc: desc,
            qty: qty,
            rate: rate,
            total: itemTotal,
            id: (desc.toString() + qty.toString() + rate.toString()).replace(/\s/g, '')
        }

        lineItems.push(item);
        totalOfItems.push(item.total);
        setSubTotal(totalOfItems.reduce((accumulator, currentVal) => accumulator + currentVal), subTotal);
        resetForm();
    }

    function resetForm() {
        setDesc("");
        setQty(1);
        setRate(0);
    }

    function clearInput(e) {
        e.target.value = "";
    }

    function print() {
        window.print();
    }

    return (
        <div id="gridContainer">
            <div id="fromInfo" class="toFrom">
                <h4>From:</h4>
                <input type="text" placeholder="From Name"></input>
                <input type="text" placeholder="From Street Address"></input>
                <input type="text" placeholder="From City, State, Zip"></input>
            </div>
            <h1 id="title">INVOICE</h1>
            <div if="toInfo" class="toFrom">
                <h4>Bill To:</h4>
                <input type="text" placeholder="To Name"></input>
                <input type="text" placeholder="To Street Address"></input>
                <input type="text" placeholder="To City, State, Zip"></input>
            </div>
            <div id="invoiceInfo">
                <div id="invInfoLeft">
                    <span>Invoice#</span><br/>
                    <span>Invoice Date</span><br/>
                    <span>Due Date</span><br/>
                    <span>Paid</span>
                </div>
                <div id="invInfoRight">
                    <input type="text" placeholder="Enter Invoice#"></input><br/>
                    <span>{invDate}</span><br/>
                    <input type="date"></input><br />
                    <input type="checkbox" />
                </div>
            </div>
            <table id="lineItemTable">
                <thead id="tableHeader">
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </thead>
                <LineItemList items={lineItems}/>
            </table>
            <hr class="line"></hr>
            <form id="lineItemForm"onSubmit={handleAdd}>
                <textarea
                    id="desc"
                    placeholder="Enter Item Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}>
                </textarea>
                <InputLabel width={window.screen.width} id="qty"/>
                <input
                    id="qty"
                    type="number"
                    step="any"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}>
                </input>
                <InputLabel width={window.screen.width} id="rate" />
                <input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={rate}
                    onFocus={(e) => clearInput(e)}
                    onChange={(e) => setRate(e.target.value)}>
                </input>
                <span id="total">{itemTotal.toFixed(2)}</span>
                <input type="submit" value="Add Item"></input>
            </form>
            <div id="invSummary">
                <span id="subTotal">Subtotal : {subTotal.toFixed(2)}</span>
                <div id="taxLabelInput">
                    <label for="tax">Sales Tax ( <span> </span>
                        <input 
                        id="tax"
                        name="tax" 
                        type="number"
                        value={tax}
                        onChange={((e) => setTax(e.target.value))}>
                        </input> %) :
                    </label>
                    <span> {(subTotal * tax/100).toFixed(2)}</span>
                </div>
                <span id="invTotal">TOTAL : ${invTotal.toFixed(2)}</span>
            </div>
            <div id="notes">
                <span>Notes :</span><br></br>
                <textarea id="notesTextArea" placeholder="Notes..."></textarea>
            </div>
            <div id="printDiv">
                <button id="printBtn" onClick={print}>PRINT INVOICE</button>
            </div>
            <footer>
                Created by Graham Hardaway
            </footer>
        </div>
    )
}

function LineItem(props) {
    return (
        <tr>
            <td>{props.desc}</td>
            <td>{props.qty}</td>
            <td>{props.rate}</td>
            <td>{props.total}</td>
        </tr>
    )
}

function LineItemList(props) {
    return (
        props.items.map(item => {
            return <LineItem 
                        key= {item.id} 
                        desc= {item.desc} 
                        qty= {item.qty} 
                        rate= {parseFloat(item.rate).toFixed(2)} 
                        total= {item.total.toFixed(2)} />
        })
    )
}

function InputLabel(props) {
    if (props.width > 480) {
        return (
            ""
        )
    }
    else return (
        <label for={props.id}>
            Enter Item {props.id === "qty" ? "Quantity" : "Rate"}
        </label>
    )
}
