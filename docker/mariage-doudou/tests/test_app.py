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
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        page = response.get_data(as_text=True)
        self.assertIn('id="previous-section"', page)
        self.assertIn('id="next-section"', page)
        self.assertIn("overflow: hidden", page)
        self.assertIn('class="book-page"', page)
        self.assertIn("--carnival-red:", page)
        self.assertIn(".hero::before", page)
        self.assertIn("radial-gradient(circle at 15% 78%", page)
        self.assertIn(".hero .eyebrow::before", page)
        self.assertIn("@keyframes turn-page-forward", page)
        self.assertIn("@keyframes turn-page-backward", page)
        self.assertIn("border-radius: 0 40% 40% 0 / 0 12% 12% 0", page)
        self.assertIn("border-radius: 40% 0 0 40% / 12% 0 0 12%", page)
        self.assertIn("inset -2.5rem 0 3rem", page)
        self.assertIn("inset 2.5rem 0 3rem", page)
        self.assertIn("prefersReducedMotion", page)
        self.assertIn("page.addEventListener(\"animationend\"", page)
        self.assertIn('id="guest-list" aria-live="polite"', page)
        self.assertNotIn('data-page-title="Photos"', page)
        self.assertEqual(page.count('class="book-page'), 4)
        self.assertLess(page.index('id="ambiance" class="book-page"'), page.index('id="rsvp" class="book-page"'))
        self.assertIn('id="invitation-button" href="#rsvp"', page)
        self.assertIn(">Répondre à l’invitation</a>", page)
        self.assertIn("Il faut d’abord parcourir tout le livre pour s’inscrire !", page)
        self.assertIn(".invitation-cta.has-message .invitation-button { left: 50% !important; top: 0 !important; }", page)
        self.assertIn("container.classList.add(\"has-message\")", page)
        self.assertIn("color: #292326", page)
        self.assertIn("function hasReadBook()", page)
        self.assertIn("const visitedPages = new Set([0]);", page)
        self.assertIn("if (unlocked && dodgeAttempts >= 3)", page)
        self.assertIn("if (dodgeAttempts >= 3) return;", page)
        self.assertIn('if (hasReadBook() && dodgeAttempts >= 3) {\n        event.preventDefault();\n        showPageById("rsvp");', page)
        self.assertIn('invitationMessage.textContent = hasReadBook()\n          ? "Vous avez parcouru tout le livre. Votre réponse vous attend !"', page)
        self.assertIn('window.matchMedia("(hover: hover) and (pointer: fine)").matches', page)
        self.assertIn("now - lastMouseDodgeAt < 700", page)
        self.assertIn('if (activationPointerType === "touch" || event.detail === 0)', page)
        self.assertIn("if (link === invitationButton) return;", page)
        self.assertIn("showPage(0);", page)
        self.assertNotIn("<nav", page)
        self.assertIn('class="invitation-cta"', page)
        self.assertIn("minimumCenter", page)
        self.assertNotIn('href="/photos"', page)
        self.assertEqual(self.client.get("/photos").status_code, 200)

    def test_photo_page_includes_a_printable_qr_code(self):
        page = self.client.get("/photos")
        self.assertEqual(page.status_code, 200)
        self.assertNotIn("/photos/static/qr-photos.svg", page.get_data(as_text=True))
        self.assertNotIn("QR code", page.get_data(as_text=True))

        qr_code = self.client.get("/photos/static/qr-photos.svg")
        self.assertEqual(qr_code.status_code, 200)
        self.assertIn("<svg", qr_code.get_data(as_text=True))
        qr_code.close()

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
