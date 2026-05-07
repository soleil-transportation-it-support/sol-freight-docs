# Role & Context
Bạn là một AI/Automation Architect và DevOps Engineer làm việc tại Soleil Transportation. Dự án trọng điểm của chúng tôi là Soleil Freight. 
Tôi cần bạn thiết kế một hệ thống tự động hóa hoàn chỉnh (End-to-End Pipeline): từ việc quét giao diện phần mềm để tạo tài liệu BRD tự động, cho đến việc xuất bản tài liệu này thành một trang web nội bộ.

# Objective
Hệ thống cần thực hiện 4 giai đoạn cốt lõi:
1. Data Extraction (Playwright): Tự động chụp ảnh màn hình và trích xuất ngữ cảnh.
2. Content Generation (AI Agents): Phân tích dữ liệu UI để viết BRD bằng định dạng Markdown.
3. Documentation Structure (Local Setup): Quản lý source file chuẩn xác tại local.
4. Publishing (MkDocs & GitHub Pages): Render HTML và deploy tự động.

# Requirements & Execution Steps

**1. Giai đoạn 1: Playwright Automation Script**
- Yêu cầu bạn phác thảo luồng xử lý (pseudo-code hoặc cấu trúc script Python/NodeJS) sử dụng Playwright.
- Nhiệm vụ: Điều hướng qua các luồng nghiệp vụ của Soleil Freight, highlight các thành phần UI, chụp ảnh lưu dưới dạng `.png`, đồng thời trích xuất DOM metadata (labels, buttons, form fields) lưu dưới dạng `.json`.

**2. Giai đoạn 2: AI Agent Workflow**
- Thiết kế luồng xử lý bằng AI Agent (có thể gợi ý dùng LangChain hoặc kịch bản prompt tuần tự).
- Agent Vision: Đọc ảnh chụp và file JSON để nhận diện các hành động trên UI.
- Agent Business Analyst: Từ dữ liệu trên, sinh ra User Stories, Acceptance Criteria và Validation Rules.
- Cấu trúc đầu ra: Mỗi màn hình/tính năng phải được xuất thành một file `[feature_name].md` lưu cùng ảnh minh họa tương ứng.

**3. Giai đoạn 3: Local Repository Structure**
- Thiết kế cây thư mục `docs/` để nhận output từ AI Agent một cách có hệ thống.
- Cấu trúc cần tách bạch rõ ràng giữa file Markdown, thư mục chứa Assets (hình ảnh), và cấu hình của công cụ tạo Static Site (ví dụ: MkDocs).

**4. Giai đoạn 4: HTML Export & GitHub Pages Deployment**
- Lựa chọn cấu hình MkDocs-Material. Cung cấp file `mkdocs.yml` tối ưu cho nhận diện thương hiệu Soleil Transportation (Soleil Freight BRD).
- Cung cấp nội dung file `.github/workflows/deploy-brd.yml` để thiết lập luồng CI/CD. Workflow này tự động build các file `.md` thành HTML và đẩy lên nhánh `gh-pages` mỗi khi có thay đổi trong thư mục `docs/`.

# Expected Output
Vui lòng cung cấp cho tôi:
1. Kiến trúc tổng thể của luồng dữ liệu (Data Flow) từ Playwright đến GitHub Pages.
2. Mã nguồn mẫu cho script Playwright (khung sườn cơ bản).
3. Luồng cấu hình Prompt/Agent cho việc sinh file Markdown.
4. Cây thư mục hệ thống.
5. File `mkdocs.yml` và file GitHub Actions `.yml`.