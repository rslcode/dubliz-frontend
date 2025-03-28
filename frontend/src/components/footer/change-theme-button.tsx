'use client'
import React from 'react'
import {useTheme} from 'next-themes'

const ThemeChanger = () => {
  const {theme, setTheme} = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
      <label className="custom-switch" style={{marginLeft: '10px'}}>
        <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
        />
        <span className="custom-switch-slider"></span>
        <style jsx>{`
          .custom-switch {
            position: relative;
            display: inline-block;
            width: 47px;
            height: 24px;
          }

          .custom-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .custom-switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 34px;
          }

          .custom-switch-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: var(--background_1);
            transition: 0.4s;
            border-radius: 50%;
          }

          input:checked + .custom-switch-slider {
            background-image: linear-gradient(to right, #f45c43, #dc533c, #f45c43);
          }

          input:checked + .custom-switch-slider:before {
            transform: translateX(22px);
          }
        `}</style>
      </label>
  )
}

export default ThemeChanger