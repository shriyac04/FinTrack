import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
function Footer() {
    const logo = require('../images/Financify.png'); 
  return (
    <>
    <div className="absolute bottom-0 footer h-[120px] w-screen px-[50px] bg-[#f4f4f4] flex items-center justify-between">
    
    <img
                    src={logo}  
                    alt="Logo"
                    className="logoImage w-[100px] h-[100px] filter grayscale"
                />


<div className="text-center">
<p>Designed By <span className='text-[#e57f57]'>Students</span></p>
<p>Copy Right 2024 All Rights Reserved</p>
</div>
<div className="text-[grey]">
<p className="font-semibold ">Connect Us On</p>
<div className="flex space-x-4 mt-2"> 
                <FaFacebook className="text-[20px] bg-[#fff]" />
                <FaInstagram className="text-[20px] bg-[#fff]" />
                <FaLinkedin className="text-[20px] bg-[#fff]" />
            </div>

</div>
    </div>
    
    </>
  )
}

export default Footer