"use client"; 
import { useState, useEffect, useRef} from "react";
import { faCircleHalfStroke, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {FaDesktop, FaUser, FaUpload, FaSave, FaBars, FaArrowLeft, FaImages, FaMobile, FaTablet, FaTimes, FaPlus} from "react-icons/fa";

export default function Home() { 
  const parentRef = useRef(null); 
  const [IsModal, setIsModal] = useState("");
  const [modalDivs, setModalDivs] = useState([]);
  let stackDivs = [];
  let [divs, setDivs] = useState([
    { id: "parent-1", parentDivId: null, className: "grid grid-cols-6 MdlDropTarget", datastacked:"no", onClick: null },

    { id: "parent-2", parentDivId: "parent-1", className: "grid grid-rows-2 gap-4 auto-rows-[minmax(0,1fr)]" , datastacked:"no", onClick: null },
    { id: "ph-1", parentDivId: "parent-2", className: "relative justify-center items-center flex bg-gray-200 h-32 square-box", datastacked:"no", onClick: null },
    { id: "ph-2", parentDivId: "parent-2", className: "bg-gray-200 justify-center items-center flex h-32 square-box", datastacked:"no", onClick: null },
    
    { id: "parent-3", parentDivId: "parent-1", className: "", datastacked:"no", onClick: null },
    { id: "drag-1", parentDivId: "parent-3", className: "h-32 flex items-center justify-center square-box DropTarget bg-[#3D8641]", draggable:true, datastacked:"no"},

    { id: "parent-4", parentDivId: "parent-1", className: "", datastacked:"no", onClick: null },
    { id: "ph-6", parentDivId: "parent-4", className: " bg-gray-200 h-32 justify-center items-center flex square-box", datastacked:"no", onClick: null },

    { id: "parent-5", parentDivId: "parent-1", className: "", datastacked:"no", onClick: null },
    { id: "ph-4", parentDivId: "parent-5", className: " bg-gray-200 justify-center items-center flex rectangle-box", datastacked:"no", onClick: null },

    { id: "parent-6", parentDivId: "parent-1", className: "", datastacked:"no", onClick: null },
    { id: "drag-2", parentDivId: "parent-6", className: "bg-[#5691E8] justify-center items-center flex col-span-2 long-rectangle DropTarget", datastacked:"no", onClick: null, draggable:true },

    { id: "ph-5", parentDivId: "parent-1", className: "bg-gray-200  justify-center items-center flex col-start-2 col-span-2 ph ", newclass: "bg-[#5691E8] sph col-span-2 ph", datastacked:"no", onClick: null },
  ]);

    const updateElement = (id, key, value) => {
      setDivs((prevDivs) =>
        prevDivs.map((div) =>
          div.id === id ? { ...div, [key]: value } : div
        )
      );  
    };

    const addClickHandler = (id) => {
      setDivs((prevDivs) =>
        prevDivs.map((div) =>
          div.id === id ? { ...div, onClick: () => openModal(id) } : div
        )
      );
    };

    const renderModalDivs = (val) => {
      if (val === true) {
        const storedDivs = JSON.parse(localStorage.getItem("divs")) || [];
        return storedDivs.filter((div) => div.datastacked === "yes");
      }
      return [];
    };

    const renderDivs = (parentId) => {     
      return divs
        .filter((div) => div.parentDivId === parentId  && (!div.hasOwnProperty("stackparentid") || div.stackparentid === null || div.stackparentid === "")) // Get children of current parent
        .map((div) => {
          // Get stack divs that belong to the current div
          stackDivs = divs.filter((stackDiv) => stackDiv.stackparentid === div.id );  
          const isDraggable = stackDivs.length === 0 && div.className.includes("DropTarget") == true && div.className.includes("MdlDropTarget") == false;        

          return (
            <div
              key={div.id}
              id={div.id}
              className={div.className}
              newclass={div.newclass || ""}
              draggable={isDraggable}
              datastacked = {div["datastacked"]} 
              onClick={div.onClick} 
            >
              {/* Render stackParent elements inside this div */}
              {IsModal === "" && (stackDivs.length > 0
                ? stackDivs
                .map((stackDiv) => (
                    <div
                      key={stackDiv.id}
                      id={stackDiv.id}
                      className={stackDiv.stackclassname}
                      stackclassname = {stackDiv.stackclassname}
                      stackparentid = {stackDiv.stackparentid}
                      newclass = {stackDiv.newclass || ""}
                      data-original-parent = {stackDiv["data-original-parent"]} 
                      draggable={false}    
                      datastacked = {stackDiv.datastacked}                  
                    >
                      {/* Render child divs inside stackParent */}
                      {renderDivs(stackDiv.id)}
                    </div>
                  ))
                : // If no stackParent divs exist, render normal child divs
                  renderDivs(div.id)
                )}
            </div>
          );
        });
    };

  function openAddModal(){
    var modal = document.getElementById("stackMdl");
    if (!modal.className.includes("hidden"))
    {
      document.getElementById("addMdl-m").classList.remove("hidden");
    }
    else{
      document.getElementById("addMdl").classList.remove("hidden");
    }    
  }

  function openModal(val) {  
    if (val != null)  {
      if (document.getElementById(val).children.length > 0){
        document.getElementById("stackMdl").classList.remove("hidden");

        var close = document.getElementById("btnCloseMdl");
        close.addEventListener("click", () => closeStack());  
    
        setIsModal("1");
        setModalDivs(renderModalDivs(true));
      }      
    }   
  }

  function closeStack() {
    setIsModal("");
    localStorage.setItem("divs", JSON.stringify(divs));
    setModalDivs(renderModalDivs(true));
    document.getElementById("stackMdl").classList.add("hidden");
  }

  function isOutsideStackMdl(element) {
      let stackMdl = document.getElementById("mdl");
      return stackMdl.contains(element);
  }

   useEffect(() => {
    localStorage.setItem("divs", JSON.stringify(divs));    
  }, [divs]);
    
  useEffect(() => {         
      var draggedElementId = "";
      let offsetX = 0;
      let offsetY = 0;

      document.addEventListener("dragstart", function(event) {
        if (!event.target.draggable) return;

        event.target.style.opacity = "0.4";
        draggedElementId = event.target.id;       

        const rect = event.target.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;     
        
        event.target.style.position = "fixed";

        updateElement(event.target.id, "data-original-parent", event.target.parentElement.id);                
     
      });
      
      document.addEventListener("dragend", function(event) {
        event.target.style.opacity = "1";        
      });
      
      document.addEventListener("dragenter", function(event) {
        if (!event.target.draggable) return;

        var draggedElementClass = "";
        if (draggedElementId != "")
          draggedElementClass = document.getElementById(draggedElementId).className;

        if ( event.target.className.indexOf("DropTarget") !== -1 && event.target.className.indexOf("MdlDropTarget") < 0 && event.target.id != draggedElementId && draggedElementClass != "inside bg-gray-200") {
          event.target.style.boxShadow = "inset 0.5px 0.5px 2px #b8b8b8";
        }                
              
      });
      
      document.addEventListener("dragover", function(event) {
        event.preventDefault(); 
       
        if (window.getComputedStyle(document.getElementById("stackMdl")).display !== "none") {
          if (!isOutsideStackMdl(event.target)){
            setIsModal("");
            localStorage.setItem("HndVal", "1");
            addClickHandler(event.target.id);
            document.getElementById("stackMdl").classList.add("hidden");
          }
          else{
            document.getElementById("stackMdl").classList.remove("hidden");
          }
      }
      
      });
      
      document.addEventListener("dragleave", function(event) {
        if (!event.target.draggable) return;
        
        var draggedElementClass = "";
        if (draggedElementId != "")
          draggedElementClass = document.getElementById(draggedElementId).className;

        if ( event.target.className.indexOf("DropTarget") !== -1 && event.target.className.indexOf("MdlDropTarget") < 0 && event.target.id != draggedElementId && draggedElementClass != "inside bg-gray-200") {
          event.target.style.boxShadow = "";
        }
      });
    
      document.addEventListener("drop", function(event) {
        event.preventDefault();           

        var hndVal = localStorage.getItem("HndVal");
        
        var draggedElement = document.getElementById(draggedElementId);

        if (draggedElement != null)  {
          if ((event.target.className.indexOf("DropTarget") !== -1 && event.target != draggedElement && event.target.className.indexOf("MdlDropTarget") < 0 && draggedElement.className != "inside bg-gray-200")) {
            event.target.style.boxShadow = "";          
            draggedElement.style.opacity = "";

            const match = draggedElement.className.match(/bg-[\w#\[\]-]+/);
            const color = match ? match[0] : null;
            
            updateElement(draggedElement.id, "datastacked", "yes");
            updateElement(draggedElement.id, "stackparentid", event.target.id);
            updateElement(draggedElement.id, "stackclassname", "inside " + color);  
            addClickHandler(event.target.id);
           
          }                           
          else if (hndVal == "1") {               

              const parentDivObj = divs.find(div => div.id === draggedElement.id);

              const parentDivValue = parentDivObj ? parentDivObj.parentDivId : null;   
              const originalClass = parentDivObj ? parentDivObj.className : null;  

              draggedElement.className = originalClass;   

              if (parentDivValue) {   
                updateElement(draggedElement.id, "datastacked", "no");
                updateElement(draggedElement.id, "stackparentid", "");   
                updateElement(draggedElement.id, "stackclassname", "");
              }
              localStorage.setItem("IsPresent","");
              localStorage.setItem("divs", JSON.stringify(divs));
              setModalDivs(renderModalDivs(true));
              localStorage.setItem("HndVal","");
          } 
          else if (event.target == draggedElement) {
            return;
          } 
          else {
            var modal = document.getElementById("stackMdl");
            if (!modal.className.includes("hidden")) {
              const dropX = event.clientX - offsetX;
              const dropY = event.clientY - offsetY;

              draggedElement.style.left = `${dropX}px`;
              draggedElement.style.top = `${dropY}px`;
            }
          }           
        }
        event.target.style.cursor= "";
      }); 
}, []);
  return (
    <div className="min-h-screen bg-gray-100 p-6" id="cer_cont">
      <div class="content" id="cer_cont1">
        <div className="grid grid-cols-3">
          <div className="flex items-center justify-center h-[3rem]">
            <button className="absolute w-[40px] h-[40px] left-4 bg-black text-white p-2 text-[14px] rounded-[10px]">
              <FaArrowLeft className="ml-[5px]"></FaArrowLeft>
            </button>
          </div>
          <div className="flex items-center justify-center h-[3rem]">
            <div className="fa-save mr-[10px]">
              <FaSave className="ml-[3px]"></FaSave>
            </div>
            <div className="dlpad mr-[10px]">
              <label className="flex items-center justify-center mt-[7px]">
                Digital Launch Pad
              </label>
            </div>
            <div className="fa-save  mr-[10px]">
              <FaBars className="ml-[3px]"></FaBars>
            </div>
          </div>
          <div className="flex items-center justify-center h-[3rem]">
            <button className="bg-green-500 text-white px-4 py-2 rounded-[10px] absolute w-[100px] h-[40px] right-[20px]">
              <FaUpload className="ml-[-7px] mt-[4px]"></FaUpload>
              <p className="mt-[-19px] mr-[-17px] mb-[0px] ml-[0px]">
                Publish
              </p>{" "}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-white text-white p-6 shadow-md scroll relative">
            {/* Icon in Top Left */}
            <button className="text-[14px] rounded-[10px] mt-[-10px] w-[40px] h-[40px] absolute left-4 bg-black text-white p-2 z-[1000]">
              <FaUser className="text-[20px] ml-[2px]"></FaUser>
            </button>

            {/* Grid Layout */}
            <div className="w-[1170px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-6 rounded-lg">
              {renderDivs(null)}
            </div>

            {/* Right Control Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="bg-black blackbox z-[1000]">
                <button className="bg-black text-white p-2 rounded-[7px] ml-[4px] bg-white !text-black mt-[3px]">
                  <FaDesktop />
                </button>
                <button className="bg-black text-white p-2 ml-[9px] text-[18px]">
                  <FaTablet />
                </button>
                <button className="bg-black text-white p-2 ml-[-5px] text-[18px]">
                  <FaMobile />
                </button>
              </div>
            </div>
            <div
              id="addMdl"
              className="absolute add-modal bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 flex items-center space-x-2 hidden"
            >
              <div>
                <div className="single">
                  <FaPlus className="mt-[21px] ml-[21px]"></FaPlus>
                </div>
                <span className="absolute top-[74px] left-[17px]">Single</span>
              </div>
              <div>
                <div className="stack">
                  <div className="stack-inner">
                    <FaPlus className="mt-[24px] ml-[24px]"></FaPlus>
                  </div>
                </div>
                <span className="absolute top-[74px] left-[91px]">Stack</span>
              </div>
              <div>
                <div className="single !left-[151px]">
                  <span className="t-text flex items-center justify-center">
                    T
                  </span>
                </div>
                <span className="absolute top-[74px] left-[164px]">Note</span>
              </div>
              <div>
                <div className="divider">
                  <div className="t-text-divider">
                    <span className="t-text flex items-center justify-center w-[50px] h-[25px]">
                      T
                    </span>
                  </div>
                </div>
                <span className="absolute top-[74px] left-[225px]">
                  Divider
                </span>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 add-container">
              <div className="addbox" onClick={openAddModal}>
                <p className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faTableCells}
                    className="w-22px h-22px"
                  />
                  &nbsp;&nbsp;<span>Add</span>
                </p>
              </div>
              <div className="half-circle m-[6px]">
                <FontAwesomeIcon
                  className="mb-[4px] text-black p-[6px]"
                  icon={faCircleHalfStroke}
                />
              </div>
              <div className="text-[30px]">
                <FaImages className="ml-[20px]" />
              </div>
              <div>
                <div className="rainbow ml-[20px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div
          id="stackMdl"
          className={` text-white p-6 shadow-md !top-[207px] scroll  absolute flex items-center justify-center bg-black bg-opacity-50 hidden`}
        >
          <div
            ref={parentRef}
            className="bg-white top-[94px] w-[1384px] h-[716px] rounded-t-[28px]  shadow-lg w-full p-6 relative"
            id="mdl"
          >
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
                  className="bg-black text-white p-2 text-lg w-[48px] h-[48px] rounded-[10px]"
                  onClick={() => closeStack()}
                >
                  <FaTimes className="ml-[7px]" />
                </button>
              </div>
            </div>

            {/* Grid Section */}
            <div className=" m-[50px]" id="parent-100">
              {modalDivs.map((div) => (
                <div
                  key={div.id}
                  id={div.id}
                  className={div.newclass || div.className}
                  stackclassname={div.stackclassname}
                  stackparentid={div.stackparentid}
                  newclass={div.newclass || ""}
                  data-original-parent={div["data-original-parent"]}
                  draggable={true}
                ></div>
              ))}
            </div>

            <div
              id="addMdl-m"
              className="absolute add-modal bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 flex items-center space-x-2 hidden"
            >
              <div>
                <div className="single">
                  <FaPlus className="mt-[21px] ml-[21px]"></FaPlus>
                </div>
                <span className="absolute top-[74px] left-[17px]">Single</span>
              </div>
              <div>
                <div className="stack">
                  <div className="stack-inner">
                    <FaPlus className="mt-[24px] ml-[24px]"></FaPlus>
                  </div>
                </div>
                <span className="absolute top-[74px] left-[91px]">Stack</span>
              </div>
              <div>
                <div className="single !left-[151px]">
                  <span className="t-text flex items-center justify-center">
                    T
                  </span>
                </div>
                <span className="absolute top-[74px] left-[164px]">Note</span>
              </div>
              <div>
                <div className="divider">
                  <div className="t-text-divider">
                    <span className="t-text flex items-center justify-center w-[50px] h-[25px]">
                      T
                    </span>
                  </div>
                </div>
                <span className="absolute top-[74px] left-[225px]">
                  Divider
                </span>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 add-container">
              <div className="addbox" onClick={openAddModal}>
                <p className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faTableCells}
                    className="w-22px h-22px"
                  />
                  &nbsp;&nbsp;<span>Add</span>
                </p>
              </div>
              <div className="half-circle m-[6px]">
                <FontAwesomeIcon
                  className="mb-[4px] text-black p-[6px]"
                  icon={faCircleHalfStroke}
                />
              </div>
              <div>
                <FaImages className="ml-[20px] w-[30px] h-[24px]" />
              </div>
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
