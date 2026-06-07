import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#242020] bg-[#121111] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9e9593]">
      
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c45a45] shadow-[0_0_6px_rgba(196,90,69,0.5)]" />
        <span className="text-white font-medium">IPO Stock</span>
      </span>

      <span>© {currentYear} All rights reserved.</span>

      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c45a45] animate-pulse shadow-[0_0_6px_rgba(196,90,69,0.6)]" />
        System Online
      </span>

    </footer>
  )
}

export default Footer