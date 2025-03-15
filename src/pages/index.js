"use client"; 
import { useState, useEffect} from "react";
import Draggable from "react-draggable";
import { faCircleHalfStroke, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {FaDesktop, FaUser, FaUpload, FaSave, FaBars, FaArrowLeft, FaImages, FaMobile, FaTablet, FaTimes, FaPlus} from "react-icons/fa";

export default function Home() {  
  const [divs, setDivs] = useState([
    { id: "parent-1", parentDivId: null, className: "grid grid-cols-6 MdlDropTarget"},

    { id: "parent-2", parentDivId: "parent-1", className: "grid grid-rows-2 gap-4 pl-[10px] auto-rows-[minmax(0,1fr)]" },
    { id: "ph-1", parentDivId: "parent-2", className: "relative justify-center items-center flex bg-gray-200 rounded-lg h-32 square-box", style: {} },
    { id: "ph-2", parentDivId: "parent-2", className: "bg-gray-200 justify-center items-center flex rounded-lg h-32 square-box", style: {} },
    
    { id: "parent-3", parentDivId: "parent-1", className: "h-s", style: {} },
    { id: "drag-1", parentDivId: "parent-3", className: "rounded-lg h-32 flex items-center justify-center square-box DropTarget bg-[#3D8641]", draggable: true  },

    { id: "parent-4", parentDivId: "parent-1", className: "h-s", style: {} },
    { id: "ph-3", parentDivId: "parent-4", className: "bg-gray-200 rounded-lg h-32 justify-center items-center flex square-box", style: {} },

    { id: "parent-5", parentDivId: "parent-1", className: "", style: {} },
    { id: "ph-4", parentDivId: "parent-5", className: "bg-gray-200 justify-center items-center flex rounded-lg h-32 rectangle-box", style: {} },

    { id: "parent-6", parentDivId: "parent-1", className: "h-r", style: {} },
    { id: "ph-5", parentDivId: "parent-6", className: "bg-gray-200 justify-center items-center flex rounded-lg h-32 col-span-2 long-rectangle", style: {} },

    { id: "drag-2", parentDivId: "parent-1", className: "bg-[#5691E8] rounded-lg justify-center items-center flex h-32 col-start-2 col-span-2 ph DropTarget", newclass: "bg-[#5691E8] sph col-span-2 ph", draggable: true },
  ]);

  const updateElement = (targetId, key, value) => {
    setDivs((prevElements) =>
      prevElements.map((item) =>
        item.id === targetId
          ? { ...item, [key]: value } 
          : item
      )
    );
  };

  const [counter, setCounter] = useState(8);

  // Function to add a new parent div dynamically
  const addParentDiv = () => {
    const newId = `parent-${counter}`;
    const newParent = { id: newId, parentDivId: null, className: "bg-gray-300 p-4 rounded", style: { margin: "10px" } };
    setDivs((prevDivs) => [...prevDivs, newParent]);
    setCounter(counter + 1); // Increment counter for next div
  };

  // Function to add a new child div inside a specific parent
  const addChildDiv = (parentId) => {
    const newId = `drag-${counter}`;
    const newChild = { id: newId, parentDivId: parentId, className: "bg-blue-200 p-2 rounded h-32 square-box", style: {} };
    setDivs((prevDivs) => [...prevDivs, newChild]);
    setCounter(counter + 1); // Increment counter for next div
  };

    const renderDivs = (parentId) => {
      return divs
        .filter((div) => div.parentDivId === parentId && (!div.hasOwnProperty("stackparentid") || div.stackParentId === null || div.stackParentId === "")) // Get children of current parent
        .map((div) => {
          // Get stack divs that belong to the current div
          const stackDivs = divs.filter((stackDiv) => stackDiv.stackparentid === div.id);
    
          return (
            <div
              key={div.id}
              id={div.id}
              className={div.className}
              style={div.style}
              newclass={div.newclass || ""}
              draggable={div.draggable || false}
            >
              {/* Render stackParent elements inside this div */}
              {stackDivs.length > 0
                ? stackDivs.map((stackDiv) => (
                    <div
                      key={stackDiv.id}
                      id={stackDiv.id}
                      className={stackDiv.stackclassname}
                      stackclassname = {stackDiv.stackclassname}
                      stackparentid = {stackDiv.stackparentid}
                      newclass = {stackDiv.newclass || ""}
                      data-original-class = {stackDiv["data-original-class"]}
                      data-original-parent = {stackDiv["data-original-parent"]}                     
                      style={stackDiv.style}
                      draggable={stackDiv.draggable || false}                      
                    >
                      {/* Render child divs inside stackParent */}
                      {renderDivs(stackDiv.id)}
                    </div>
                  ))
                : // If no stackParent divs exist, render normal child divs
                  renderDivs(div.id)}
            </div>
          );
        });
    };

  function openAddModal(){
    document.getElementById("stackMdl").classList.remove("hidden");
  }

  function openModal(val) {    
    document.querySelector("#hndIsMdl").value = "1";     
    var close = document.getElementById("btnCloseMdl");
    close.addEventListener("click", () => closeStack());  
    const parentDiv = document.getElementById("parent-100");
    if (parentDiv != null) {
      let childDiv = document.querySelector("#" + val).childNodes;
      if (childDiv && childDiv.length > 0) {
        document.getElementById("stackMdl").classList.remove("hidden");
        Array.from(childDiv).forEach(child => {
          if (child.getAttribute("newclass") != "")
            child.className = child.getAttribute("newclass")
          else
            child.className = child.getAttribute("data-original-class");

          parentDiv.appendChild(child);
        });
      }
    }
  }

  function toGetStack(){
    let childDiv = document.querySelector("#parent-100").childNodes;
    if (childDiv && childDiv.length > 0) {
        Array.from(childDiv).forEach(child => { 
          var id = child.getAttribute("stackparentid");
          if (id) {
              var parentDiv = document.getElementById(id);
              child.className = "inside bg-gray-200";
              parentDiv.appendChild(child);
          }
      });      
    }    
    document.getElementById("stackMdl").classList.add("hidden");
  }

  function closeStack() {
    toGetStack();
    //renderDivs(null);
    document.querySelector("#hndIsMdl").value = "";
  }

  function isOutsideStackMdl(element) {
      let stackMdl = document.getElementById("mdl");
      return stackMdl.contains(element);
  }
    
  useEffect(() => {         
      var draggedElementId = "";
      document.addEventListener("dragstart", function(event) {
        if (!event.target.draggable) return;

        event.target.style.opacity = "0.4";
        event.dataTransfer.setData("Text", event.target.id);
        draggedElementId = event.target.id;

        updateElement(event.target.id, "data-original-parent", event.target.parentElement.id);
        updateElement(event.target.id, "data-original-class", event.target.className);        
        
        if (sessionStorage.getItem(event.target.id + "class") == null || sessionStorage.getItem(event.target.id + "class") == "undefined") 
          sessionStorage.setItem(event.target.id + "class", event.target.className); 
     
      });
      
      document.addEventListener("dragend", function(event) {
        event.target.style.opacity = "1";          
      });
      
      document.addEventListener("dragenter", function(event) {
        if (!event.target.draggable) return;

        //var draggedElementId = document.querySelector("#hndBoxId").value;
        var draggedElementClass = document.getElementById(draggedElementId).className;

        if ( event.target.className.indexOf("DropTarget") !== -1 && event.target.className.indexOf("MdlDropTarget") < 0 && event.target.id != draggedElementId && draggedElementClass != "inside bg-gray-200") {
          event.target.style.boxShadow = "inset 0.5px 0.5px 2px #b8b8b8";
        }        
        
        const stackMdl = document.getElementById("stackMdl");
        var modalVisibility = getComputedStyle(stackMdl).visibility;
        if (!isOutsideStackMdl(event.target) && stackMdl && modalVisibility === "hidden") {
            document.body.appendChild(event.target);  
            toGetStack();     
        }         
      });
      
      document.addEventListener("dragover", function(event) {
        event.preventDefault();        
      });
      
      document.addEventListener("dragleave", function(event) {
        if (!event.target.draggable) return;

        var draggedElementClass = document.getElementById(draggedElementId).className;

        if ( event.target.className.indexOf("DropTarget") !== -1 && event.target.className.indexOf("MdlDropTarget") < 0 && event.target.id != draggedElementId && draggedElementClass != "inside bg-gray-200") {
          event.target.style.boxShadow = "";
        }
      });
    
      document.addEventListener("drop", function(event) {
        if (!event.target.draggable) return;

        event.preventDefault();   
        
        var draggedElement = document.getElementById(draggedElementId);
        var isModal = document.querySelector("#hndIsMdl").value;

        if (draggedElement != null)  {
          if ((event.target.className.indexOf("DropTarget") !== -1 && event.target != draggedElement && event.target.className.indexOf("MdlDropTarget") < 0 && draggedElement.className != "inside bg-gray-200")) {
            event.target.style.boxShadow = "";          
            draggedElement.style.opacity = "";
            
            updateElement(draggedElement.id, "draggable", false);
            updateElement(draggedElement.id, "stackparentid", event.target.id);
            updateElement(draggedElement.id, "stackclassname", "inside bg-gray-200"); 
            updateElement(draggedElement.id, "stackparentid", event.target.id);          
            
            event.target.addEventListener("click", () => openModal(event.target.id));              
           
          }
          else if (event.target == draggedElement) {
            return;
          }          
          // else if (isModal == "1") { 
          //   const stackMdl = document.getElementById("stackMdl");

          //   if (stackMdl && getComputedStyle(stackMdl).visibility === "hidden")  {              
          //     draggedElement.removeAttribute("stackParentId");
          //     var originalParentId = draggedElement.getAttribute("data-original-parent");

          //     if (originalParentId) {
          //       draggedElement.className = sessionStorage.getItem(document.getElementById(data).id + "class");              
          //       document.getElementById(originalParentId).appendChild(draggedElement);
          //     }
          //     changingStyle(draggedElement);
          //     document.querySelector("#hndIsMdl").value = "";
          //    }
          // }          
        }
      }); 
}, []);
  return (   
    <div className="min-h-screen bg-gray-100 p-6" id="cer_cont"> 
    <input type="hidden" id="hndBoxId" name="hndBoxId" value=""></input>
    <input type="hidden" id="hndIsMdl" name="hndIsMdl" value=""></input>
      <div class="content" id="cer_cont1">                  
          <div className="grid grid-cols-3" >
            <div className="flex items-center justify-center h-[3rem]" >
              <button className="absolute left-4 bg-black text-white p-2 text-[14px] rounded-[7px]">
                <FaArrowLeft></FaArrowLeft>
              </button>
            </div>
            <div className="flex items-center justify-center h-[3rem]">
              <div className="fa-save mr-[10px]"><FaSave className="ml-[3px]"></FaSave></div>  
              <div className="dlpad mr-[10px]">Digital Launch Pad</div>          
              <div className="fa-save  mr-[10px]"><FaBars className="ml-[3px]"></FaBars></div>  
            </div>
            <div className="flex items-center justify-center h-[3rem]" >
              <button className="bg-green-500 text-white px-4 py-2 rounded-md absolute w-[108px] right-[20px]" ><FaUpload className="ml-[-11px]"></FaUpload><p className="mt-[-19px] mr-[-17px] mb-[0px] ml-[0px]" >Publish</p> </button>            
            </div>
          </div> 
          <div className="flex items-center justify-center">            
            <div className="bg-white text-white p-6 shadow-md scroll relative" >
              {/* Icon in Top Left */}
              <button className="text-[14px] rounded-[10px] mt-[-10px] w-[40px] h-[40px] absolute left-4 bg-black text-white p-2 z-1">
                <FaUser className="text-[20px] ml-[2px]"
                ></FaUser>
              </button>

              {/* Grid Layout */} 
              <div className="w-[1170px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-6 rounded-lg">
                {renderDivs(null)} 
              </div>

              {/* Right Control Buttons */} 
              <div className="absolute top-4 right-4 flex space-x-2">          
                <div className="bg-black blackbox z-1" >              
                      <button  className="bg-black text-white p-2 rounded-[7px] ml-[4px] bg-white !text-black mt-[3px]">
                        <FaDesktop />
                      </button>
                    <button className="bg-black text-white p-2 ml-[9px] text-[18px]" >         
                      <FaTablet />
                    </button>
                    <button className="bg-black text-white p-2 ml-[-5px] text-[18px]" >         
                      <FaMobile />
                    </button>
                </div> 
              </div>
              <div id="addMdl"  className="absolute add-modal bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 flex items-center space-x-2">
                  <div>
                    <div className="single">
                        <FaPlus className="mt-[20px] ml-[20px]" ></FaPlus>
                    </div>
                    <span className="absolute top-[74px] left-[17px]" >Single</span>
                  </div>
                  <div>
                    <div className="stack">
                      <div className="stack-inner"> 
                      <FaPlus className="mt-[24px] ml-[24px]" ></FaPlus>
                      </div>                     
                    </div>
                    <span className="absolute top-[74px] left-[102px]" >Stack</span>
                  </div>
                  <div>
                    <div className="single !left-[160px]" >
                      <span className="t-text flex items-center justify-center">T</span>
                    </div>
                    <span className="absolute top-[74px] left-[170px]" >Note</span>
                  </div>
                  <div>
                    <div className="divider">
                      <div className="t-text-divider"><span className="t-text flex items-center justify-center w-[50px] h-[25px]">T</span></div>
                    </div>
                    <span className="absolute top-[74px] left-[237px]" >Divider</span>
                  </div>                
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 add-container">
                  <div className="addbox" onClick={openAddModal}> 
                      <p className="flex items-center justify-center" ><FontAwesomeIcon icon={faTableCells} className="w-22px h-22px" />&nbsp;&nbsp;<span>Add</span></p> 
                  </div>
                  <div className="half-circle m-[6px]" ><FontAwesomeIcon className="mb-[4px] text-black p-[6px]" icon={faCircleHalfStroke} /></div>
                  <div className="text-[30px]" ><FaImages className="ml-[20px]" /></div>
                  <div>
                    <div className="rainbow ml-[20px]"></div>
                  </div>                                
              </div>            
            </div>
          </div>          
        </div>     
        <div className="flex items-center justify-center" >   
            <div id="stackMdl"  className="text-white p-6 shadow-md !top-[207px] scroll  absolute flex items-center justify-center bg-black bg-opacity-50 hidden" >
                <div className="bg-white top-[94px] w-[1384px] h-[716px] rounded-t-[28px]  shadow-lg w-full p-6 relative" id="mdl">
              
              {/* Header */}
              <div className="mb-6">
                <div className="flex justify-between items-center m-[50px]">
                  <input
                    className="border border-gray-300 px-4 py-2 w-[191px] h-[48px] rounded-[10px]"
                    type="text"
                    placeholder="Add title"
                  />
                  <button
                    id="btnCloseMdl"
                    className="bg-black text-white p-2 text-lg w-[48px] h-[48px] rounded-[10px]" >
                    <FaTimes className="ml-[7px]" />
                  </button>
                </div>
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-6 gap-2 m-[50px]" id="parent-100">
                
              </div>

              <div id="addMdl"  className="absolute add-modal bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 flex items-center space-x-2">
                  <div>
                    <div className="single">
                        <FaPlus className="mt-[20px] ml-[20px]" ></FaPlus>
                    </div>
                    <span className="absolute top-[74px] left-[17px]" >Single</span>
                  </div>
                  <div>
                    <div className="stack">
                      <div className="stack-inner"> 
                      <FaPlus className="mt-[24px] ml-[24px]" ></FaPlus>
                      </div>                     
                    </div>
                    <span className="absolute top-[74px] left-[102px]" >Stack</span>
                  </div>
                  <div>
                    <div className="single !left-[160px]" >
                      <span className="t-text flex items-center justify-center">T</span>
                    </div>
                    <span className="absolute top-[74px] left-[170px]" >Note</span>
                  </div>
                  <div>
                    <div className="divider">
                      <div className="t-text-divider"><span className="t-text flex items-center justify-center w-[50px] h-[25px]">T</span></div>
                    </div>
                    <span className="absolute top-[74px] left-[237px]" >Divider</span>
                  </div>                
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 add-container">
                  <div className="addbox" onClick={openAddModal}> 
                      <p className="flex items-center justify-center" ><FontAwesomeIcon icon={faTableCells} className="w-22px h-22px" />&nbsp;&nbsp;<span>Add</span></p> 
                  </div>
                  <div className="half-circle m-[6px]" ><FontAwesomeIcon className="mb-[4px] text-black p-[6px]" icon={faCircleHalfStroke} /></div>
                  <div className="text-[30px]" ><FaImages className="ml-[20px]" /></div>
                  <div>
                    <div className="rainbow ml-[20px]"></div>
                  </div>                                
              </div> 
              </div>
            </div> 
        </div>
    </div>     
  );
}
