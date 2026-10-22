import os
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app import server


class UploadPathTests(unittest.TestCase):
    def test_image_uses_photo_folder(self):
        self.assertEqual(
            server.get_storage_directory("photo.jpg"),
            os.path.join(server.UPLOAD_ROOT, "photos"),
        )

    def test_video_uses_video_folder(self):
        self.assertEqual(
            server.get_storage_directory("clip.mp4"),
            os.path.join(server.UPLOAD_ROOT, "videos"),
        )


if __name__ == "__main__":
    unittest.main()
