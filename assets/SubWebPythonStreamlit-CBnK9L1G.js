import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{l as t}from"./vendor-charts-CbAVlM39.js";import{$ as n,Ft as r,H as i,_t as a,at as o,bt as s,ct as c,d as l,ht as u,l as d,m as f,mt as p,n as m,st as h,v as g,x as _,yt as v}from"./vendor-react-igAF31tP.js";var y=e(t(),1),b=m(),x=[{name:`Hoa nhài`,tier:`Hương đầu`,safeLimit:40},{name:`Đào`,tier:`Hương giữa`,safeLimit:50},{name:`Vanilla`,tier:`Hương cuối`,safeLimit:20},{name:`Xạ hương trắng`,tier:`Hương cuối`,safeLimit:10},{name:`Ethanol 90°`,tier:`Dung môi`,safeLimit:100},{name:`Nước cất`,tier:`Dung môi`,safeLimit:100}],S=`import streamlit as st
import pandas as pd

# --- Cấu hình trang ---
st.set_page_config(page_title="Pha Chế Nước Hoa", page_icon="🌸", layout="centered")
st.title("🌸 Hệ Thống Phối Trộn Nước Hoa")

# --- 1. ĐỌC BẢNG NGUYÊN LIỆU ---
st.header("1. Dữ liệu nguyên liệu")
st.write("Tải lên bảng nguyên liệu do giáo viên cung cấp (CSV hoặc Excel).")

# Tải file từ máy tính
uploaded_file = st.file_uploader("Chọn file CSV hoặc Excel", type=['csv', 'xlsx'])

# Dữ liệu mẫu
@st.cache_data
def load_sample_data():
    return pd.DataFrame({
        'Tên nguyên liệu': [
            'Hoa nhài', 'Đào', 
            'Vanilla', 'Xạ hương trắng', 'Ethanol 90°', 'Nước cất'
        ],
        'Tầng hương': [
            'Hương đầu', 'Hương giữa', 
            'Hương cuối', 'Hương cuối', 'Dung môi', 'Dung môi'
        ],
        'Giới hạn an toàn (%)': [40.0, 50.0, 20.0, 10.0, 100.0, 100.0]
    })

if uploaded_file is not None:
    # Đọc file dựa vào định dạng
    if uploaded_file.name.endswith('csv'):
        df_ingredients = pd.read_csv(uploaded_file)
    else:
        df_ingredients = pd.read_excel(uploaded_file)
    st.success("Đã tải dữ liệu thành công!")
else:
    df_ingredients = load_sample_data()
    st.info("Đang sử dụng dữ liệu mẫu. Hãy tải file của giáo viên lên để thay thế.")

# Hiển thị bảng gốc cho học sinh dễ theo dõi
with st.expander("Xem bảng nguyên liệu"):
    st.dataframe(df_ingredients, use_container_width=True)

# --- 2. CÀI ĐẶT THÔNG SỐ CHUNG ---
st.header("2. Thông số mẻ pha chế")
col1, col2 = st.columns(2)
with col1:
    season = st.selectbox("Chọn mùa sử dụng:", ["Xuân", "Hạ", "Thu", "Đông"])
with col2:
    batch_volume = st.number_input("Thể tích mẻ (ml):", min_value=1.0, value=50.0, step=1.0)

# --- 3. ĐIỀU CHỈNH TỈ LỆ & KIỂM TRA ĐIỀU KIỆN ---
st.header("3. Tỉ lệ thành phần (%)")
st.caption("Kéo thanh trượt để điều chỉnh. Tổng phải bằng chính xác 100%.")

percentages = {}
total_percentage = 0.0
limit_error = False

# Tạo slider cho từng nguyên liệu
for index, row in df_ingredients.iterrows():
    name = row['Tên nguyên liệu']
    note = row['Tầng hương']
    safe_limit = float(row['Giới hạn an toàn (%)'])
    
    val = st.slider(
        f"{name} ({note}) - Giới hạn an toàn: {safe_limit}%",
        min_value=0.0, max_value=100.0, value=0.0, step=0.5
    )
    
    percentages[name] = val
    total_percentage += val
    
    # Báo lỗi ngay lập tức dưới thanh trượt nếu vượt mức
    if val > safe_limit:
        st.error(f"⚠️ {name} đang vượt quá giới hạn an toàn ({val}% > {safe_limit}%)")
        limit_error = True

# Hiển thị tổng phần trăm theo thời gian thực
color = "green" if total_percentage == 100 else "red"
st.markdown(f"### Tổng tỉ lệ: <span style='color:{color}'>{total_percentage}%</span>", unsafe_allow_html=True)

# --- 4. TÍNH TOÁN & XUẤT CÔNG THỨC ---
st.header("4. Kết quả & Xuất công thức")

# Kiểm tra 2 điều kiện tiên quyết
if total_percentage != 100.0:
    st.error("❌ Tổng tỉ lệ chưa đạt 100%. Không thể tính toán và xuất công thức.")
elif limit_error:
    st.error("❌ Có nguyên liệu vượt giới hạn an toàn. Không thể xuất công thức.")
else:
    st.success("✅ Công thức hợp lệ!")
    
    # Tính thể tích và đưa vào danh sách
    results = []
    for index, row in df_ingredients.iterrows():
        name = row['Tên nguyên liệu']
        note = row['Tầng hương']
        pct = percentages[name]
        
        if pct > 0:
            # V_i = V_mẻ × %_i / 100
            vol = batch_volume * (pct / 100.0)
            results.append({
                "Tên nguyên liệu": name,
                "Tầng hương": note,
                "Tỉ lệ (%)": pct,
                "Thể tích (ml)": round(vol, 2)
            })
            
    df_results = pd.DataFrame(results)
    st.dataframe(df_results, use_container_width=True)
    
    # --- 5. MÔ TẢ MÙI THEO TẦNG CHIẾM ƯU THẾ ---
    # Lọc các tầng hương thơm (loại bỏ dung môi) để đánh giá mùi hương chính xác
    df_fragrance = df_results[df_results['Tầng hương'].isin(['Hương đầu', 'Hương giữa', 'Hương cuối'])]
    
    if not df_fragrance.empty:
        note_sums = df_fragrance.groupby('Tầng hương')['Tỉ lệ (%)'].sum()
        if not note_sums.empty:
            dominant_note = note_sums.idxmax() # Lấy tên tầng hương có tỉ lệ cao nhất
            max_pct = note_sums.max()
            
            st.subheader("Mô tả hương thơm dự kiến")
            st.write(f"**Tầng hương ưu thế:** {dominant_note} ({max_pct}%)")
            
            if dominant_note == "Hương đầu":
                st.info("🍃 **Đặc điểm:** Tươi mát, tỏa hương mạnh mẽ ngay khi xịt. Tạo ấn tượng ban đầu sắc nét. Phù hợp cho những ngày rực rỡ và năng động.")
            elif dominant_note == "Hương giữa":
                st.info("🌸 **Đặc điểm:** Tròn trịa, hài hòa và là 'trái tim' của chai nước hoa. Mùi hương êm dịu, lưu luyến, mang lại cảm giác thanh lịch.")
            else: # Hương cuối
                st.info("🪵 **Đặc điểm:** Trầm ấm, sâu lắng và bám da cực tốt. Độ lưu hương lâu, mang lại cảm giác bí ẩn, sang trọng. Rất hợp cho buổi tối hoặc thời tiết lạnh.")

    # --- 6. NÚT TẢI XUỐNG CSV ---
    # Sử dụng utf-8-sig để hỗ trợ hiển thị tiếng Việt chuẩn trong Excel
    csv_data = df_results.to_csv(index=False).encode('utf-8-sig')
    
    st.download_button(
        label="📥 Tải xuống công thức (CSV)",
        data=csv_data,
        file_name=f"Cong_Thuc_Nuoc_Hoa_{season}_{batch_volume}ml.csv",
        mime="text/csv",
    )
`,C=({onBackToMainWeb:e,onSyncFormulaToWeb:t})=>{let[m,C]=(0,y.useState)(`app`),[w,T]=(0,y.useState)(!0),[E,D]=(0,y.useState)(null),[O,k]=(0,y.useState)(x),[A,j]=(0,y.useState)(`Xuân`),[M,N]=(0,y.useState)(50),[P,F]=(0,y.useState)({"Hoa nhài":20,Đào:25,Vanilla:10,"Xạ hương trắng":5,"Ethanol 90°":35,"Nước cất":5}),[I,L]=(0,y.useState)(!1),{totalPercentage:R,hasLimitError:z}=(0,y.useMemo)(()=>{let e=0,t={},n=!1;return O.forEach(r=>{let i=P[r.name]||0;e+=i,i>r.safeLimit&&(t[r.name]=!0,n=!0)}),{totalPercentage:Math.round(e*10)/10,limitErrors:t,hasLimitError:n}},[O,P]),B=(0,y.useMemo)(()=>R!==100||z?[]:O.filter(e=>(P[e.name]||0)>0).map(e=>{let t=P[e.name]||0,n=Math.round(t/100*M*100)/100;return{name:e.name,tier:e.tier,percentage:t,volume:n}}),[R,z,O,P,M]),V=(0,y.useMemo)(()=>{if(B.length===0)return null;let e=B.filter(e=>[`Hương đầu`,`Hương giữa`,`Hương cuối`].includes(e.tier));if(e.length===0)return null;let t={};e.forEach(e=>{t[e.tier]=(t[e.tier]||0)+e.percentage});let n=``,r=-1;return Object.entries(t).forEach(([e,t])=>{t>r&&(r=t,n=e)}),{dominantNote:n,maxPct:Math.round(r*10)/10}},[B]),H=(e,t)=>{F(n=>({...n,[e]:t}))};return(0,b.jsxs)(`div`,{className:`space-y-6 animate-fadeIn text-[#2D3A2F]`,children:[(0,b.jsxs)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DFD5] shadow-xs`,children:[(0,b.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,b.jsx)(`button`,{type:`button`,onClick:e,className:`p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E0D8CB] text-[#5A685F] hover:text-[#1F2F23] transition-colors`,title:`Quay lại Trang chính`,children:(0,b.jsx)(r,{className:`w-5 h-5`})}),(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(`span`,{className:`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF4B4B]/10 text-[#FF4B4B] border border-[#FF4B4B]/30 font-bold flex items-center gap-1`,children:`Streamlit App`}),(0,b.jsx)(`span`,{className:`text-xs text-[#6B7C70] font-sans`,children:`Python 3.11 • app1_8ba4d2ea.py`})]}),(0,b.jsx)(`h1`,{className:`text-xl sm:text-2xl font-serif font-bold text-[#1F2F23]`,children:`Hệ Thống Phối Trộn Nước Hoa (Ứng Dụng Python Streamlit)`})]})]}),(0,b.jsxs)(`div`,{className:`flex items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl border border-[#E0D8CB] self-start sm:self-auto`,children:[(0,b.jsxs)(`button`,{type:`button`,onClick:()=>C(`app`),className:`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${m===`app`?`bg-[#FFFFFF] text-[#245437] shadow-xs font-bold`:`text-[#617366] hover:text-[#1F2F23]`}`,children:[(0,b.jsx)(_,{className:`w-4 h-4 text-[#3B7A57]`}),(0,b.jsx)(`span`,{children:`Trực Tiếp Trên Web`})]}),(0,b.jsxs)(`button`,{type:`button`,onClick:()=>C(`code`),className:`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${m===`code`?`bg-[#FFFFFF] text-[#245437] shadow-xs font-bold`:`text-[#617366] hover:text-[#1F2F23]`}`,children:[(0,b.jsx)(n,{className:`w-4 h-4 text-[#3B7A57]`}),(0,b.jsx)(`span`,{children:`Mã Nguồn Python`})]})]})]}),m===`app`&&(0,b.jsx)(`div`,{className:`space-y-6`,children:(0,b.jsxs)(`div`,{className:`max-w-3xl mx-auto bg-[#FFFFFF] border border-[#E6DFD5] rounded-3xl p-5 sm:p-8 shadow-md space-y-7`,children:[(0,b.jsxs)(`div`,{className:`border-b border-[#E8E1D5] pb-4`,children:[(0,b.jsxs)(`h2`,{className:`text-2xl sm:text-3xl font-bold text-[#1F2F23] flex items-center gap-2`,children:[(0,b.jsx)(`span`,{children:`🌸`}),(0,b.jsx)(`span`,{children:`Hệ Thống Phối Trộn Nước Hoa`})]}),(0,b.jsx)(`p`,{className:`text-xs text-[#6B7C70] mt-1 font-mono`,children:`Bản mô phỏng chuẩn giao diện Streamlit (st.set_page_config & st.title)`})]}),(0,b.jsxs)(`div`,{className:`space-y-3.5`,children:[(0,b.jsx)(`h3`,{className:`text-lg font-bold text-[#1F2F23] flex items-center gap-2 border-l-4 border-[#3B7A57] pl-2.5`,children:`1. Dữ liệu nguyên liệu`}),(0,b.jsx)(`p`,{className:`text-xs text-[#526356]`,children:`Tải lên bảng nguyên liệu do giáo viên cung cấp (CSV hoặc Excel).`}),(0,b.jsxs)(`div`,{className:`p-4 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#DCD5C9] hover:border-[#3B7A57] transition-colors text-center relative`,children:[(0,b.jsx)(`input`,{type:`file`,accept:`.csv,.xlsx`,onChange:e=>{var t;let n=(t=e.target.files)==null?void 0:t[0];if(!n)return;D(n.name);let r=new FileReader;r.onload=e=>{var t;let n=(t=e.target)==null?void 0:t.result;if(n){let e=n.split(`
`).filter(e=>e.trim().length>0);if(e.length>1){let t=[];for(let n=1;n<e.length;n++){let r=e[n].split(`,`).map(e=>e.replace(/"/g,``).trim());if(r.length>=3){let e=r[0],n=r[1],i=parseFloat(r[2])||100;t.push({name:e,tier:n,safeLimit:i})}}if(t.length>0){k(t);let e={};t.forEach(t=>{e[t.name]=0}),F(e)}}}},r.readAsText(n)},className:`absolute inset-0 opacity-0 cursor-pointer w-full h-full`,title:`Chọn file CSV hoặc Excel`}),(0,b.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-1.5 text-xs text-[#6B7C70]`,children:[(0,b.jsx)(d,{className:`w-6 h-6 text-[#3B7A57]`}),(0,b.jsx)(`span`,{className:`font-semibold text-[#1F2F23]`,children:E?`File đã tải: ${E}`:`Chọn file CSV hoặc Excel`}),(0,b.jsx)(`span`,{className:`text-[11px] text-[#8E9B91]`,children:`Kéo thả hoặc bấm để duyệt tệp tin`})]})]}),E?(0,b.jsxs)(`div`,{className:`p-3 rounded-xl bg-[#EEF5F0] border border-[#CFE2D4] text-xs text-[#245236] font-medium flex items-center gap-2`,children:[(0,b.jsx)(u,{className:`w-4 h-4 text-[#3B7A57]`}),(0,b.jsxs)(`span`,{children:[`Đã tải dữ liệu thành công từ file: `,(0,b.jsx)(`strong`,{children:E})]})]}):(0,b.jsxs)(`div`,{className:`p-3 rounded-xl bg-[#F0F7FF] border border-[#BFDBFE] text-xs text-[#1E40AF] font-medium flex items-center gap-2`,children:[(0,b.jsx)(i,{className:`w-4 h-4 text-[#3B82F6] shrink-0`}),(0,b.jsxs)(`span`,{children:[`Đang sử dụng dữ liệu nguyên liệu từ `,(0,b.jsx)(`strong`,{children:`app1_8ba4d2ea.py`}),`. Hãy tải file của giáo viên lên để thay thế nếu có file mới.`]})]}),(0,b.jsxs)(`div`,{className:`border border-[#E5DFD5] rounded-2xl overflow-hidden bg-[#FAF8F5]`,children:[(0,b.jsxs)(`button`,{type:`button`,onClick:()=>T(!w),className:`w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#1F2F23] hover:bg-[#F2ECE1] transition-colors`,children:[(0,b.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(h,{className:`w-4 h-4 text-[#3B7A57]`}),`Xem bảng nguyên liệu (`,O.length,` thành phần)`]}),w?(0,b.jsx)(a,{className:`w-4 h-4 text-[#6B7C70]`}):(0,b.jsx)(v,{className:`w-4 h-4 text-[#6B7C70]`})]}),w&&(0,b.jsx)(`div`,{className:`p-3 border-t border-[#E8E1D5] bg-[#FFFFFF] overflow-x-auto`,children:(0,b.jsxs)(`table`,{className:`w-full text-xs text-left border-collapse`,children:[(0,b.jsx)(`thead`,{children:(0,b.jsxs)(`tr`,{className:`border-b border-[#E8E1D5] text-[11px] font-mono text-[#6A7B6E] uppercase bg-[#FAF8F5]`,children:[(0,b.jsx)(`th`,{className:`py-2 px-3 text-center`,children:`STT`}),(0,b.jsx)(`th`,{className:`py-2 px-3`,children:`Tên nguyên liệu`}),(0,b.jsx)(`th`,{className:`py-2 px-3`,children:`Tầng hương`}),(0,b.jsx)(`th`,{className:`py-2 px-3 text-right`,children:`Giới hạn an toàn (%)`})]})}),(0,b.jsx)(`tbody`,{className:`divide-y divide-[#EFE9DF]`,children:O.map((e,t)=>(0,b.jsxs)(`tr`,{className:`hover:bg-[#FAF8F5]/80`,children:[(0,b.jsx)(`td`,{className:`py-2 px-3 text-center font-mono text-[11px] text-[#6A7B6E]`,children:t+1}),(0,b.jsx)(`td`,{className:`py-2 px-3 font-semibold text-[#1F2F23]`,children:e.name}),(0,b.jsx)(`td`,{className:`py-2 px-3 font-mono text-[#58685B]`,children:(0,b.jsx)(`span`,{className:`px-2 py-0.5 rounded-full text-[10px] ${e.tier===`Hương đầu`?`bg-[#FEF3C7] text-[#92400E]`:e.tier===`Hương giữa`?`bg-[#FCE7F3] text-[#9D174D]`:e.tier===`Hương cuối`?`bg-[#EDE9FE] text-[#5B21B6]`:`bg-[#E5E7EB] text-[#374151]`}`,children:e.tier})}),(0,b.jsxs)(`td`,{className:`py-2 px-3 text-right font-mono font-bold text-[#1F2F23]`,children:[e.safeLimit.toFixed(1),`%`]})]},t))})]})})]})]}),(0,b.jsxs)(`div`,{className:`space-y-3.5 pt-3 border-t border-[#E8E1D5]`,children:[(0,b.jsx)(`h3`,{className:`text-lg font-bold text-[#1F2F23] flex items-center gap-2 border-l-4 border-[#3B7A57] pl-2.5`,children:`2. Thông số mẻ pha chế`}),(0,b.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-4`,children:[(0,b.jsxs)(`div`,{className:`space-y-1.5`,children:[(0,b.jsx)(`label`,{className:`text-xs font-semibold text-[#3D4F42] block`,children:`Chọn mùa sử dụng:`}),(0,b.jsxs)(`select`,{value:A,onChange:e=>j(e.target.value),className:`w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-xs sm:text-sm font-medium text-[#1F2F23] focus:outline-none focus:ring-2 focus:ring-[#3B7A57]/30`,children:[(0,b.jsx)(`option`,{value:`Xuân`,children:`Xuân`}),(0,b.jsx)(`option`,{value:`Hạ`,children:`Hạ`}),(0,b.jsx)(`option`,{value:`Thu`,children:`Thu`}),(0,b.jsx)(`option`,{value:`Đông`,children:`Đông`})]})]}),(0,b.jsxs)(`div`,{className:`space-y-1.5`,children:[(0,b.jsx)(`label`,{className:`text-xs font-semibold text-[#3D4F42] block`,children:`Thể tích mẻ (ml):`}),(0,b.jsx)(`input`,{type:`number`,min:1,step:1,value:M,onChange:e=>N(Math.max(1,parseFloat(e.target.value)||1)),className:`w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-xs sm:text-sm font-mono font-bold text-[#1F2F23] focus:outline-none focus:ring-2 focus:ring-[#3B7A57]/30`})]})]})]}),(0,b.jsxs)(`div`,{className:`space-y-4 pt-3 border-t border-[#E8E1D5]`,children:[(0,b.jsxs)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-2`,children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h3`,{className:`text-lg font-bold text-[#1F2F23] flex items-center gap-2 border-l-4 border-[#3B7A57] pl-2.5`,children:`3. Tỉ lệ thành phần (%)`}),(0,b.jsx)(`p`,{className:`text-xs text-[#6B7C70] mt-0.5`,children:`Kéo thanh trượt để điều chỉnh. Tổng phải bằng chính xác 100%.`})]}),(0,b.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,b.jsxs)(`button`,{type:`button`,onClick:()=>{F({"Hoa nhài":20,Đào:25,Vanilla:10,"Xạ hương trắng":5,"Ethanol 90°":35,"Nước cất":5})},className:`px-2.5 py-1 rounded-lg bg-[#EEF5F0] hover:bg-[#E2EDE5] text-[#245236] border border-[#CFE2D4] text-[11px] font-semibold flex items-center gap-1 transition-colors`,title:`Nạp công thức chuẩn 100%`,children:[(0,b.jsx)(g,{className:`w-3 h-3 text-[#3B7A57]`}),(0,b.jsx)(`span`,{children:`Nạp mẫu chuẩn 100%`})]}),(0,b.jsx)(`button`,{type:`button`,onClick:()=>{let e={};O.forEach(t=>{e[t.name]=0}),F(e)},className:`px-2 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#617366] border border-[#E0D8CB] text-[11px] transition-colors`,title:`Đặt lại tất cả về 0%`,children:`Về 0%`})]})]}),(0,b.jsx)(`div`,{className:`space-y-4`,children:O.map(e=>{let t=P[e.name]||0,n=t>e.safeLimit;return(0,b.jsxs)(`div`,{className:`p-3.5 rounded-2xl border transition-all ${n?`bg-[#FEF2F2] border-[#FCA5A5]`:`bg-[#FAF8F5] border-[#E5DFD5]`}`,children:[(0,b.jsxs)(`div`,{className:`flex items-center justify-between gap-2 mb-2`,children:[(0,b.jsxs)(`label`,{className:`text-xs font-semibold text-[#1F2F23] flex items-center gap-1.5`,children:[(0,b.jsx)(`span`,{children:e.name}),(0,b.jsxs)(`span`,{className:`text-[11px] font-normal text-[#6B7C70]`,children:[`(`,e.tier,`)`]}),(0,b.jsxs)(`span`,{className:`text-[10px] font-mono text-[#8E9B91]`,children:[`· Giới hạn an toàn: `,e.safeLimit.toFixed(1),`%`]})]}),(0,b.jsxs)(`span`,{className:`text-sm font-mono font-bold px-2 py-0.5 rounded-md ${n?`bg-[#FEE2E2] text-[#DC2626]`:`bg-[#EEF5F0] text-[#245437]`}`,children:[t.toFixed(1),`%`]})]}),(0,b.jsx)(`div`,{className:`flex items-center gap-3`,children:(0,b.jsx)(`input`,{type:`range`,min:0,max:100,step:.5,value:t,onChange:t=>H(e.name,parseFloat(t.target.value)||0),className:`pyramid-touch-slider w-full cursor-pointer`})}),n&&(0,b.jsxs)(`p`,{className:`text-xs text-[#DC2626] font-medium mt-2 flex items-center gap-1.5 bg-[#FEE2E2] p-2 rounded-lg`,children:[(0,b.jsx)(l,{className:`w-3.5 h-3.5 shrink-0`}),(0,b.jsxs)(`span`,{children:[`⚠️ `,e.name,` đang vượt quá giới hạn an toàn (`,t,`% > `,e.safeLimit,`%)`]})]})]},e.name)})}),(0,b.jsxs)(`div`,{className:`p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between`,children:[(0,b.jsx)(`span`,{className:`text-sm font-semibold text-[#1F2F23]`,children:`Tổng tỉ lệ toàn bộ thành phần:`}),(0,b.jsxs)(`span`,{className:`text-xl sm:text-2xl font-mono font-bold px-3 py-1 rounded-xl border ${R===100?`bg-[#EEF5F0] text-[#16A34A] border-[#86EFAC]`:`bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]`}`,children:[R.toFixed(1),`%`]})]})]}),(0,b.jsxs)(`div`,{className:`space-y-4 pt-3 border-t border-[#E8E1D5]`,children:[(0,b.jsx)(`h3`,{className:`text-lg font-bold text-[#1F2F23] flex items-center gap-2 border-l-4 border-[#3B7A57] pl-2.5`,children:`4. Kết quả & Xuất công thức`}),R===100?z?(0,b.jsxs)(`div`,{className:`p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs sm:text-sm text-[#DC2626] font-medium flex items-center gap-2`,children:[(0,b.jsx)(l,{className:`w-5 h-5 shrink-0`}),(0,b.jsx)(`span`,{children:`❌ Có nguyên liệu vượt giới hạn an toàn. Không thể xuất công thức.`})]}):(0,b.jsxs)(`div`,{className:`space-y-5`,children:[(0,b.jsxs)(`div`,{className:`p-3.5 rounded-2xl bg-[#EEF5F0] border border-[#86EFAC] text-xs sm:text-sm text-[#16A34A] font-bold flex items-center gap-2`,children:[(0,b.jsx)(u,{className:`w-5 h-5 shrink-0`}),(0,b.jsx)(`span`,{children:`✅ Công thức hợp lệ!`})]}),(0,b.jsxs)(`div`,{className:`border border-[#E5DFD5] rounded-2xl overflow-hidden bg-[#FFFFFF]`,children:[(0,b.jsxs)(`div`,{className:`px-4 py-2.5 bg-[#FAF8F5] border-b border-[#E8E1D5] font-mono text-xs font-semibold text-[#4E6053]`,children:[`Bảng thể tích thành phẩm (Mẻ `,M,` mL • Mùa `,A,`)`]}),(0,b.jsx)(`div`,{className:`overflow-x-auto`,children:(0,b.jsxs)(`table`,{className:`w-full text-xs text-left border-collapse`,children:[(0,b.jsx)(`thead`,{children:(0,b.jsxs)(`tr`,{className:`border-b border-[#E8E1D5] text-[11px] font-mono text-[#6A7B6E] uppercase bg-[#FAF8F5]`,children:[(0,b.jsx)(`th`,{className:`py-2.5 px-3 text-center`,children:`STT`}),(0,b.jsx)(`th`,{className:`py-2.5 px-3`,children:`Tên nguyên liệu`}),(0,b.jsx)(`th`,{className:`py-2.5 px-3`,children:`Tầng hương`}),(0,b.jsx)(`th`,{className:`py-2.5 px-3 text-right`,children:`Tỉ lệ (%)`}),(0,b.jsx)(`th`,{className:`py-2.5 px-3 text-right font-bold text-[#3B7A57]`,children:`Thể tích (ml)`})]})}),(0,b.jsx)(`tbody`,{className:`divide-y divide-[#EFE9DF]`,children:B.map((e,t)=>(0,b.jsxs)(`tr`,{className:`hover:bg-[#FAF8F5]/80`,children:[(0,b.jsx)(`td`,{className:`py-2.5 px-3 text-center font-mono text-[11px] text-[#6A7B6E]`,children:t+1}),(0,b.jsx)(`td`,{className:`py-2.5 px-3 font-semibold text-[#1F2F23]`,children:e.name}),(0,b.jsx)(`td`,{className:`py-2.5 px-3 font-mono text-[#58685B]`,children:e.tier}),(0,b.jsxs)(`td`,{className:`py-2.5 px-3 text-right font-mono font-medium text-[#1F2F23]`,children:[e.percentage.toFixed(1),`%`]}),(0,b.jsxs)(`td`,{className:`py-2.5 px-3 text-right font-mono font-bold text-[#16A34A]`,children:[e.volume.toFixed(2),` ml`]})]},t))})]})})]}),V&&(0,b.jsxs)(`div`,{className:`p-4 sm:p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2`,children:[(0,b.jsxs)(`h4`,{className:`text-sm font-bold text-[#166534] flex items-center gap-1.5`,children:[(0,b.jsx)(`span`,{children:`🌸`}),(0,b.jsx)(`span`,{children:`Mô tả hương thơm dự kiến`})]}),(0,b.jsxs)(`p`,{className:`text-xs text-[#1F2F23]`,children:[(0,b.jsx)(`strong`,{children:`Tầng hương ưu thế:`}),` `,V.dominantNote,` (`,V.maxPct,`%)`]}),(0,b.jsxs)(`div`,{className:`p-3 rounded-xl bg-[#FFFFFF] border border-[#DCFCE7] text-xs text-[#14532D] leading-relaxed`,children:[V.dominantNote===`Hương đầu`&&(0,b.jsxs)(`p`,{children:[`🍃 `,(0,b.jsx)(`strong`,{children:`Đặc điểm:`}),` Tươi mát, tỏa hương mạnh mẽ ngay khi xịt. Tạo ấn tượng ban đầu sắc nét. Phù hợp cho những ngày rực rỡ và năng động.`]}),V.dominantNote===`Hương giữa`&&(0,b.jsxs)(`p`,{children:[`🌸 `,(0,b.jsx)(`strong`,{children:`Đặc điểm:`}),` Tròn trịa, hài hòa và là "trái tim" của chai nước hoa. Mùi hương êm dịu, lưu luyến, mang lại cảm giác thanh lịch.`]}),V.dominantNote===`Hương cuối`&&(0,b.jsxs)(`p`,{children:[`🪵 `,(0,b.jsx)(`strong`,{children:`Đặc điểm:`}),` Trầm ấm, sâu lắng và bám da cực tốt. Độ lưu hương lâu, mang lại cảm giác bí ẩn, sang trọng. Rất hợp cho buổi tối hoặc thời tiết lạnh.`]})]})]}),(0,b.jsxs)(`div`,{className:`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5`,children:[(0,b.jsxs)(`button`,{type:`button`,onClick:()=>{if(B.length===0)return;let e=`﻿Tên nguyên liệu,Tầng hương,Tỉ lệ (%),Thể tích (ml)
`+B.map(e=>`"${e.name}","${e.tier}",${e.percentage},${e.volume}`).join(`
`),t=new Blob([e],{type:`text/csv;charset=utf-8;`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`Cong_Thuc_Nuoc_Hoa_${A}_${M}ml.csv`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)},className:`px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D6344] to-[#3B7A57] hover:from-[#245237] hover:to-[#2D6344] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all`,children:[(0,b.jsx)(o,{className:`w-4 h-4`}),(0,b.jsx)(`span`,{children:`📥 Tải xuống công thức (CSV)`})]}),t&&(0,b.jsxs)(`button`,{type:`button`,onClick:()=>{t(B.map(e=>({name:e.name,percentage:e.percentage})),A,M)},className:`px-4 py-2.5 rounded-xl bg-[#EEF5F0] hover:bg-[#E2EDE5] text-[#245236] border border-[#CFE2D4] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all`,title:`Đưa các tỉ lệ nguyên liệu từ App Python vào Xưởng pha chế Web`,children:[(0,b.jsx)(g,{className:`w-4 h-4 text-[#3B7A57]`}),(0,b.jsx)(`span`,{children:`Áp dụng vào Xưởng pha chế Web`})]})]})]}):(0,b.jsxs)(`div`,{className:`p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs sm:text-sm text-[#DC2626] font-medium flex items-center gap-2`,children:[(0,b.jsx)(p,{className:`w-5 h-5 shrink-0`}),(0,b.jsx)(`span`,{children:`❌ Tổng tỉ lệ chưa đạt 100%. Không thể tính toán và xuất công thức.`})]})]})]})}),m===`code`&&(0,b.jsxs)(`div`,{className:`max-w-4xl mx-auto bg-[#FFFFFF] border border-[#E6DFD5] rounded-3xl p-5 sm:p-8 shadow-md space-y-5`,children:[(0,b.jsxs)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D5] pb-4`,children:[(0,b.jsxs)(`div`,{children:[(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(n,{className:`w-5 h-5 text-[#3B7A57]`}),(0,b.jsx)(`h2`,{className:`text-xl font-bold text-[#1F2F23]`,children:`Mã Nguồn Streamlit: app1_8ba4d2ea.py`})]}),(0,b.jsxs)(`p`,{className:`text-xs text-[#6B7C70] mt-0.5`,children:[`File lưu trực tiếp tại `,(0,b.jsx)(`code`,{className:`text-[#3B7A57] bg-[#EEF5F0] px-1.5 py-0.5 rounded`,children:`public/assets/aistudio/app1_8ba4d2ea.py`})]})]}),(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(`button`,{type:`button`,onClick:()=>{navigator.clipboard.writeText(S),L(!0),setTimeout(()=>L(!1),2500)},className:`px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#2D5E41] border border-[#CFE2D4] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs`,children:I?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(s,{className:`w-4 h-4 text-[#10B981]`}),(0,b.jsx)(`span`,{children:`Đã sao chép!`})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c,{className:`w-4 h-4`}),(0,b.jsx)(`span`,{children:`Sao chép mã`})]})}),(0,b.jsxs)(`button`,{type:`button`,onClick:()=>{let e=new Blob([S],{type:`text/x-python;charset=utf-8;`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`app1_8ba4d2ea.py`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(t)},className:`px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#2D6344] to-[#3B7A57] hover:from-[#245237] hover:to-[#2D6344] text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all`,children:[(0,b.jsx)(o,{className:`w-4 h-4`}),(0,b.jsx)(`span`,{children:`Tải app1_8ba4d2ea.py`})]})]})]}),(0,b.jsxs)(`div`,{className:`p-4 rounded-2xl bg-[#F8F5EE] border border-[#E5DFD5] space-y-2 text-xs`,children:[(0,b.jsxs)(`span`,{className:`font-semibold text-[#1F2F23] flex items-center gap-1.5`,children:[(0,b.jsx)(f,{className:`w-4 h-4 text-[#3B7A57]`}),`Hướng dẫn chạy trên máy tính cá nhân:`]}),(0,b.jsxs)(`div`,{className:`font-mono bg-[#1E293B] text-slate-100 p-3 rounded-xl overflow-x-auto space-y-1`,children:[(0,b.jsx)(`p`,{className:`text-slate-400`,children:`# 1. Cài đặt các thư viện cần thiết:`}),(0,b.jsx)(`p`,{className:`text-emerald-400 font-bold`,children:`pip install streamlit pandas openpyxl`}),(0,b.jsx)(`p`,{className:`text-slate-400 mt-2`,children:`# 2. Khởi chạy ứng dụng Streamlit:`}),(0,b.jsx)(`p`,{className:`text-amber-300 font-bold`,children:`streamlit run public/assets/aistudio/app1_8ba4d2ea.py`})]})]}),(0,b.jsxs)(`div`,{className:`rounded-2xl border border-[#E5DFD5] overflow-hidden bg-[#1E293B]`,children:[(0,b.jsxs)(`div`,{className:`px-4 py-2 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400`,children:[(0,b.jsx)(`span`,{children:`Python 3.11 • UTF-8`}),(0,b.jsx)(`span`,{children:`144 dòng lệnh`})]}),(0,b.jsx)(`pre`,{className:`p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[550px] overflow-y-auto`,children:S})]})]})]})};export{C as SubWebPythonStreamlit};