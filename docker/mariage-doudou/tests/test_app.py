import base64
import csv
import io
import tempfile
import unittest
from pathlib import Path

from server import app, initialize_database


class WeddingSiteTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        root = Path(self.temp_dir.name)
        app.config.update(
            TESTING=True,
            RSVP_DATABASE=str(root / "rsvps.sqlite3"),
            UPLOAD_FOLDER=str(root / "uploads"),
            ADMIN_USERNAME="test-admin",
            ADMIN_PASSWORD="test-password",
        )
        Path(app.config["UPLOAD_FOLDER"]).mkdir()
        initialize_database()
        self.client = app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_wedding_and_photo_pages_load(self):
        self.assertEqual(self.client.get("/").status_code, 200)
        self.assertEqual(self.client.get("/photos").status_code, 200)

    def test_individual_rsvps_and_dietary_requirements_are_exported(self):
        response = self.client.post(
            "/rsvp",
            json={
                "guests": [
                    {
                        "name": "Camille",
                        "attending": True,
                        "dietary_requirements": "Allergie aux noix",
                    },
                    {
                        "name": "Alex",
                        "attending": False,
                        "dietary_requirements": "",
                    },
                ]
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["guests_saved"], 2)

        credentials = base64.b64encode(b"test-admin:test-password").decode()
        headers = {
            "Authorization": f"Basic {credentials}",
            "X-Forwarded-Proto": "https",
        }
        dashboard = self.client.get("/admin", headers=headers)
        self.assertEqual(dashboard.status_code, 200)
        self.assertIn("Allergie aux noix", dashboard.get_data(as_text=True))

        response = self.client.get("/admin/rsvps.csv", headers=headers)
        self.assertEqual(response.status_code, 200)
        rows = list(csv.reader(io.StringIO(response.get_data(as_text=True))))
        self.assertEqual(rows[1][0:3], ["Camille", "Oui", "Allergie aux noix"])
        self.assertEqual(rows[2][0:3], ["Alex", "Non", ""])

    def test_admin_requires_authentication_and_https(self):
        self.assertEqual(self.client.get("/admin").status_code, 400)
        response = self.client.get("/admin", headers={"X-Forwarded-Proto": "https"})
        self.assertEqual(response.status_code, 401)

    def test_rsvp_rejects_missing_guest_or_presence(self):
        response = self.client.post(
            "/rsvp",
            json={"guests": [{"name": "Camille", "attending": "yes"}]},
        )
        self.assertEqual(response.status_code, 400)

    def test_rsvp_rejects_more_than_ten_guests(self):
        response = self.client.post(
            "/rsvp",
            json={
                "guests": [
                    {"name": f"Invité {index}", "attending": True}
                    for index in range(11)
                ]
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_event_details_and_deadline_are_visible(self):
        page = self.client.get("/").get_data(as_text=True)
        for detail in (
            "18 h 30",
            "Pot d’accueil",
            "18 h 45",
            "cérémonie laïque",
            "19 h 15",
            "Début des festivités",
            "11 mai 2027",
            "gratuit",
            "500 à 600 places",
            "208 rue Sadi Carnot",
            "Allergies ou régime alimentaire",
        ):
            self.assertIn(detail, page)

    def test_photo_upload_is_saved_to_configured_upload_directory(self):
        response = self.client.post(
            "/photos/upload",
            data={"photo": (io.BytesIO(b"test image"), "souvenir.jpg")},
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 201)
        saved_path = Path(app.config["UPLOAD_FOLDER"]) / response.json["files"][0]
        self.assertTrue(saved_path.is_file())
        self.assertEqual(saved_path.read_bytes(), b"test image")


if __name__ == "__main__":
    unittest.main()
