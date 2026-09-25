"""OCR API endpoints."""

from fastapi import APIRouter, File, UploadFile, status
try:
    from backend.shared.schemas.response import StandardResponse
except ImportError:
    from shared.schemas.response import StandardResponse

from app.schemas.ai_requests import OCRExtractBase64Request
from app.schemas.ai_responses import OCRExtractResponse
from app.services.ocr_service import ocr_service

router = APIRouter(prefix="/ocr", tags=["OCR"])


@router.post(
    "/extract",
    response_model=StandardResponse[OCRExtractResponse],
    status_code=status.HTTP_200_OK,
    summary="Extract text from uploaded image file",
    description="Accepts an image file (multipart/form-data), enhances it with OpenCV, and runs OCR to extract signboards, notices, or text.",
)
async def extract_ocr_from_file(
    file: UploadFile = File(..., description="Image file (JPG, PNG, WebP)")
):
    contents = await file.read()
    result = await ocr_service.extract_from_bytes(contents)
    return StandardResponse(
        data=result,
        message="Text extracted successfully from image"
    )


@router.post(
    "/extract-base64",
    response_model=StandardResponse[OCRExtractResponse],
    status_code=status.HTTP_200_OK,
    summary="Extract text from base64 encoded image",
    description="Accepts JSON containing base64 encoded image string and performs OCR text extraction.",
)
async def extract_ocr_from_base64(
    request: OCRExtractBase64Request
):
    result = await ocr_service.extract_from_base64(request.image_base64)
    return StandardResponse(
        data=result,
        message="Text extracted successfully from base64 image"
    )
