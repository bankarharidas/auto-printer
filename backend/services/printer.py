import sys
import os
import asyncio
import logging

logger = logging.getLogger(__name__)

class PrinterService:
    def __init__(self):
        self.platform = sys.platform
        self.is_windows = self.platform == "win32"
        self.is_linux = self.platform.startswith("linux")

    async def print_file(self, file_path: str, printer_name: str = None, copies: int = 1):
        """
        Sends a file to the printer.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        logger.info(f"Printing file: {file_path} (Copies: {copies})")

        try:
            if self.is_windows:
                await self._print_windows(file_path, printer_name, copies)
            elif self.is_linux:
                await self._print_linux(file_path, printer_name, copies)
            else:
                # Mock for other platforms (e.g. macOS dev)
                logger.warning(f"Printing not supported on {self.platform}. Simulating print.")
                await asyncio.sleep(2) 
        except Exception as e:
            logger.error(f"Print failed: {e}")
            raise e

    async def _print_windows(self, file_path: str, printer_name: str, copies: int):
        try:
            import win32api
            import win32print
            
            if not printer_name:
                printer_name = win32print.GetDefaultPrinter()
            
            logger.info(f"Using Windows printer: {printer_name}")
            
            # Note: ShellExecute is a simple way to print, but offers less control than raw sending.
            # For a kiosk, sending raw PCL/PostScript might be better, but depends on the driver.
            # Using 'printto' verb.
            
            # A more robust way for PDFs is using a PDF reader command line or Ghostscript.
            # For simplicity in this demo, we use ShellExecute which relies on default app.
            # WARNING: This might open a window. 
            # In a real embedded kiosk, we'd likely use Ghostscript or raw socket printing.
            
            # Simulating async execution
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._windows_print_sync, file_path, printer_name)
            
        except ImportError:
            logger.error("pywin32 not installed. Cannot print on Windows.")
            raise

    def _windows_print_sync(self, file_path, printer_name):
        import win32api
        win32api.ShellExecute(0, "printto", file_path, f'"{printer_name}"', ".", 0)

    async def _print_linux(self, file_path: str, printer_name: str, copies: int):
        try:
            import cups
            conn = cups.Connection()
            printers = conn.getPrinters()
            
            if not printer_name:
                if not printers:
                    raise Exception("No printers found on CUPS")
                printer_name = list(printers.keys())[0]
            
            logger.info(f"Using CUPS printer: {printer_name}")
            
            job_id = conn.printFile(printer_name, file_path, "Kiosk Print Job", {"copies": str(copies)})
            logger.info(f"CUPS Job ID: {job_id}")
            
        except ImportError:
            logger.error("pycups not installed. Cannot print on Linux.")
            raise

printer_service = PrinterService()
