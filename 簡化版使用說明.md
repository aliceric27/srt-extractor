# 簡化版 SRT 字幕處理器

## 概述

這是一個簡化的 SRT 字幕檔案處理工具，支援兩種模式：
1. **雙語模式**：專門處理含有中文的雙語字幕
2. **單語模式**：處理純英文或其他單語字幕

## 功能列表

### 雙語模式
- **提取中文**：從雙語 SRT 檔案提取中文文本
- **替換中文**：使用修改後的中文文本替換回 SRT 檔案

### 單語模式  
- **提取所有文本**：從單語 SRT 檔案提取所有文本
- **替換所有文本**：使用修改後的文本替換回 SRT 檔案

## 檔案對應規則

系統使用固定的檔案對應規則，無需手動指定：

### 雙語模式
```
原始檔案：檔案名.srt
文本檔案：檔案名_中文文本.txt
輸出檔案：檔案名_修改後.srt
```

### 單語模式
```
原始檔案：檔案名.srt
文本檔案：檔案名_所有文本.txt
輸出檔案：檔案名_修改後.srt
```

## 主要工具

- `simple_srt_tool.py` - 主要處理程式
- `simple_batch.py` - 批次處理程式

## 使用方式

### 1. 單檔處理

#### 雙語模式（提取中文）
```bash
python simple_srt_tool.py "檔案名.srt" -e
```

#### 雙語模式（替換中文）
```bash
python simple_srt_tool.py "檔案名.srt" -r
```

#### 單語模式（提取所有文本）
```bash
python simple_srt_tool.py "檔案名.srt" -a
```

#### 單語模式（替換所有文本）
```bash
python simple_srt_tool.py "檔案名.srt" -s
```

#### 查看對應關係
```bash
python simple_srt_tool.py "檔案名.srt"
```

### 2. 批次處理

```bash
python simple_batch.py
```

選單功能：
1. 批次提取所有 SRT 檔案的中文文本
2. 批次提取所有 SRT 檔案的所有文本（非雙語字幕用）
3. 批次替換所有有對應中文文本檔案的 SRT
4. 批次替換所有有對應所有文本檔案的 SRT
5. 顯示檔案對應關係
6. 退出

## 工作流程

### 雙語字幕工作流程：

1. **提取階段**
   ```bash
   python simple_srt_tool.py "episode01.srt" -e
   ```
   產生：`episode01_中文文本.txt`

2. **編輯階段**
   - 用文字編輯器開啟 `episode01_中文文本.txt`
   - 修改需要的中文文本
   - 儲存檔案

3. **替換階段**
   ```bash
   python simple_srt_tool.py "episode01.srt" -r
   ```
   產生：`episode01_修改後.srt`

### 單語字幕工作流程：

1. **提取階段**
   ```bash
   python simple_srt_tool.py "movie_english.srt" -a
   ```
   產生：`movie_english_所有文本.txt`

2. **編輯階段**
   - 用文字編輯器開啟 `movie_english_所有文本.txt`
   - 修改需要的文本（如翻譯成其他語言）
   - 儲存檔案

3. **替換階段**
   ```bash
   python simple_srt_tool.py "movie_english.srt" -s
   ```
   產生：`movie_english_修改後.srt`

### 批次處理流程：

#### 雙語字幕批次處理：
1. **批次提取中文**
   ```bash
   python simple_batch.py
   # 選擇 1
   ```

2. **編輯所有中文文本檔案**

3. **批次替換中文**
   ```bash
   python simple_batch.py
   # 選擇 3
   ```

#### 單語字幕批次處理：
1. **批次提取所有文本**
   ```bash
   python simple_batch.py
   # 選擇 2
   ```

2. **編輯所有文本檔案**

3. **批次替換所有文本**
   ```bash
   python simple_batch.py
   # 選擇 4
   ```

## 實際範例

### 雙語字幕處理範例
```bash
# 目錄中有：movie.srt

# 1. 提取中文文本
python simple_srt_tool.py "movie.srt" -e
# 產生：movie_中文文本.txt

# 2. 編輯 movie_中文文本.txt

# 3. 替換中文文本
python simple_srt_tool.py "movie.srt" -r
# 產生：movie_修改後.srt
```

### 單語字幕處理範例
```bash
# 目錄中有：english_movie.srt

# 1. 提取所有文本
python simple_srt_tool.py "english_movie.srt" -a
# 產生：english_movie_所有文本.txt

# 2. 編輯 english_movie_所有文本.txt（例如翻譯成中文）

# 3. 替換所有文本
python simple_srt_tool.py "english_movie.srt" -s
# 產生：english_movie_修改後.srt

# 2. 編輯 movie_中文文本.txt（使用任何文字編輯器）

# 3. 替換中文文本
python simple_srt_tool.py "movie.srt" -r
# 產生：movie_修改後.srt
```

### 處理長檔名
```bash
# 檔案：Common.Side.Effects.S01E01.Pilot.1080p.AMZN.WEB-DL.DDP5.1.H.264-VARYG.chs&eng [deepseek].srt

# 提取
python simple_srt_tool.py "Common.Side.Effects.S01E01.Pilot.1080p.AMZN.WEB-DL.DDP5.1.H.264-VARYG.chs&eng [deepseek].srt" -e

# 產生：Common.Side.Effects.S01E01.Pilot.1080p.AMZN.WEB-DL.DDP5.1.H.264-VARYG.chs&eng [deepseek]_中文文本.txt

# 替換
python simple_srt_tool.py "Common.Side.Effects.S01E01.Pilot.1080p.AMZN.WEB-DL.DDP5.1.H.264-VARYG.chs&eng [deepseek].srt" -r

# 產生：Common.Side.Effects.S01E01.Pilot.1080p.AMZN.WEB-DL.DDP5.1.H.264-VARYG.chs&eng [deepseek]_修改後.srt
```

## 輸出範例

### 提取輸出
```
=== 簡化版 SRT 中文文本處理器 ===

處理檔案：movie.srt
對應文本檔案：movie_中文文本.txt
輸出檔案：movie_修改後.srt

正在從 movie.srt 提取中文文本...
✓ 成功提取 150 條中文文本
✓ 已保存到：movie_中文文本.txt

前10條提取的文本：
  1. 你好嗎？
  2. 我很好。
  3. 謝謝你。
  ...

💡 提示：編輯 movie_中文文本.txt 後，可執行替換：
   python simple_srt_tool.py "movie.srt" -r
```

### 替換輸出
```
=== 簡化版 SRT 中文文本處理器 ===

處理檔案：movie.srt
對應文本檔案：movie_中文文本.txt
輸出檔案：movie_修改後.srt

正在使用 movie_中文文本.txt 替換中文文本...
✓ 已替換 150 條中文文本
✓ 修改後的檔案已保存到：movie_修改後.srt
```

## 優點

1. **簡單直觀**：只有提取和替換兩個功能
2. **固定對應**：檔案命名規則固定，不會混淆
3. **批次支援**：可一次處理多個檔案
4. **容錯性強**：自動跳過不存在的檔案
5. **視覺化**：清楚顯示檔案對應關係

## 注意事項

1. **檔案編碼**：確保所有檔案使用 UTF-8 編碼
2. **檔案名稱**：含空格的檔案名請用引號包圍
3. **編輯順序**：替換文本必須與原文本順序對應
4. **備份建議**：原始檔案不會被覆蓋，但建議備份
5. **中文識別**：自動識別繁體和簡體中文字符

## 錯誤處理

- 找不到 SRT 檔案：顯示錯誤並退出
- 找不到對應的中文文本檔案：提示先執行提取
- 文本數量不匹配：多餘的文本被忽略，缺少的保留原文
- 檔案讀寫錯誤：顯示具體錯誤資訊

## 檔案清理

處理完成後，目錄中會有：
- 原始 SRT 檔案（未修改）
- 中文文本檔案（可編輯）
- 修改後的 SRT 檔案（新產生）

如需清理中間檔案，可手動刪除 `*_中文文本.txt` 檔案。
