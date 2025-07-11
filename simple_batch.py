#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
簡化版批次處理器
支援批次提取和替換 SRT 檔案
"""

import os
import glob
import subprocess
import sys

def batch_extract():
    """批次提取所有 SRT 檔案的中文文本"""
    srt_files = glob.glob("*.srt")
    
    if not srt_files:
        print("在當前目錄中找不到 SRT 檔案")
        return
    
    print(f"找到 {len(srt_files)} 個 SRT 檔案")
    print("="*60)
    
    success_count = 0
    
    for srt_file in srt_files:
        print(f"\n處理檔案：{srt_file}")
        
        try:
            cmd = [sys.executable, "simple_srt_tool.py", srt_file, "-e"]
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            if result.returncode == 0:
                print("✓ 提取成功")
                success_count += 1
                # 顯示提取結果摘要
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if "成功提取" in line:
                        print(f"  {line}")
                        break
            else:
                print("✗ 提取失敗")
                if result.stderr:
                    print(f"  錯誤：{result.stderr}")
                    
        except Exception as e:
            print(f"✗ 處理錯誤：{e}")
    
    print("\n" + "="*60)
    print(f"批次提取完成：成功處理 {success_count}/{len(srt_files)} 個檔案")

def batch_extract_all():
    """批次提取所有 SRT 檔案的所有文本（非雙語字幕用）"""
    srt_files = glob.glob("*.srt")
    
    if not srt_files:
        print("在當前目錄中找不到 SRT 檔案")
        return
    
    print(f"找到 {len(srt_files)} 個 SRT 檔案")
    print("="*60)
    
    success_count = 0
    
    for srt_file in srt_files:
        print(f"\n處理檔案：{srt_file}")
        
        try:
            cmd = [sys.executable, "simple_srt_tool.py", srt_file, "-a"]
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            if result.returncode == 0:
                print("✓ 提取成功")
                success_count += 1
                # 顯示提取結果摘要
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if "成功提取" in line:
                        print(f"  {line}")
                        break
            else:
                print("✗ 提取失敗")
                if result.stderr:
                    print(f"  錯誤：{result.stderr}")
                    
        except Exception as e:
            print(f"✗ 處理錯誤：{e}")
    
    print("\n" + "="*60)
    print(f"批次提取完成：成功處理 {success_count}/{len(srt_files)} 個檔案")

def batch_replace():
    """批次替換所有有對應中文文本檔案的 SRT 檔案"""
    text_files = glob.glob("*_中文文本.txt")
    
    if not text_files:
        print("在當前目錄中找不到中文文本檔案")
        print("請先執行批次提取功能")
        return
    
    print(f"找到 {len(text_files)} 個中文文本檔案")
    print("="*60)
    
    success_count = 0
    
    for text_file in text_files:
        # 根據文本檔案名稱推導對應的 SRT 檔案
        srt_file = text_file.replace("_中文文本.txt", ".srt")
        
        if not os.path.exists(srt_file):
            print(f"\n跳過：找不到對應的 SRT 檔案 {srt_file}")
            continue
        
        print(f"\n處理檔案：{srt_file}")
        
        try:
            cmd = [sys.executable, "simple_srt_tool.py", srt_file, "-r"]
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            if result.returncode == 0:
                print("✓ 替換成功")
                success_count += 1
                # 顯示替換結果摘要
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if "已替換" in line:
                        print(f"  {line}")
                        break
            else:
                print("✗ 替換失敗")
                if result.stderr:
                    print(f"  錯誤：{result.stderr}")
                    
        except Exception as e:
            print(f"✗ 處理錯誤：{e}")
    
    print("\n" + "="*60)
    print(f"批次替換完成：成功處理 {success_count}/{len(text_files)} 個檔案")

def batch_replace_all():
    """批次替換所有有對應所有文本檔案的 SRT 檔案"""
    text_files = glob.glob("*_所有文本.txt")
    
    if not text_files:
        print("在當前目錄中找不到所有文本檔案")
        print("請先執行批次提取所有文本功能")
        return
    
    print(f"找到 {len(text_files)} 個所有文本檔案")
    print("="*60)
    
    success_count = 0
    
    for text_file in text_files:
        # 根據文本檔案名稱推導對應的 SRT 檔案
        srt_file = text_file.replace("_所有文本.txt", ".srt")
        
        if not os.path.exists(srt_file):
            print(f"\n跳過：找不到對應的 SRT 檔案 {srt_file}")
            continue
        
        print(f"\n處理檔案：{srt_file}")
        
        try:
            cmd = [sys.executable, "simple_srt_tool.py", srt_file, "-s"]
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            if result.returncode == 0:
                print("✓ 替換成功")
                success_count += 1
                # 顯示替換結果摘要
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if "已替換" in line:
                        print(f"  {line}")
                        break
            else:
                print("✗ 替換失敗")
                if result.stderr:
                    print(f"  錯誤：{result.stderr}")
                    
        except Exception as e:
            print(f"✗ 處理錯誤：{e}")
    
    print("\n" + "="*60)
    print(f"批次替換完成：成功處理 {success_count}/{len(text_files)} 個檔案")

def show_file_pairs():
    """顯示檔案對應關係"""
    srt_files = glob.glob("*.srt")
    chinese_text_files = glob.glob("*_中文文本.txt")
    all_text_files = glob.glob("*_所有文本.txt")
    output_files = glob.glob("*_修改後.srt")
    
    print("檔案對應關係：")
    print("="*60)
    
    # 按 SRT 檔案顯示對應關係
    for srt_file in sorted(srt_files):
        expected_chinese_text = srt_file.replace(".srt", "_中文文本.txt")
        expected_all_text = srt_file.replace(".srt", "_所有文本.txt")
        expected_output = srt_file.replace(".srt", "_修改後.srt")
        
        print(f"\n原始檔案：{srt_file}")
        print(f"中文文本檔案：{expected_chinese_text} {'✓' if expected_chinese_text in chinese_text_files else '✗'}")
        print(f"所有文本檔案：{expected_all_text} {'✓' if expected_all_text in all_text_files else '✗'}")
        print(f"輸出檔案：{expected_output} {'✓' if expected_output in output_files else '✗'}")

def main():
    """主程式"""
    print("=== 簡化版批次處理器 ===\n")
    
    print("選擇功能：")
    print("1. 批次提取所有 SRT 檔案的中文文本")
    print("2. 批次提取所有 SRT 檔案的所有文本（非雙語字幕用）")
    print("3. 批次替換所有有對應中文文本檔案的 SRT")
    print("4. 批次替換所有有對應所有文本檔案的 SRT")
    print("5. 顯示檔案對應關係")
    print("6. 退出")
    
    while True:
        choice = input("\n請選擇 (1-6): ").strip()
        
        if choice == '1':
            print("\n開始批次提取中文文本...")
            batch_extract()
            
        elif choice == '2':
            print("\n開始批次提取所有文本...")
            batch_extract_all()
            
        elif choice == '3':
            print("\n開始批次替換中文文本...")
            batch_replace()
            
        elif choice == '4':
            print("\n開始批次替換所有文本...")
            batch_replace_all()
            
        elif choice == '5':
            print()
            show_file_pairs()
            
        elif choice == '6':
            print("再見！")
            break
            
        else:
            print("✗ 無效選擇，請重新輸入")

if __name__ == "__main__":
    main()
