from typing import List

from sqlalchemy.orm import Session

from db import CRUDBase
from playlists import models, schemas
from messages.controller import crud as message_crud


class CRUDPlaylist(CRUDBase[models.Playlist, schemas.PlaylistCreate, schemas.PlaylistUpdate]):
    def create_playlist(
        self, db: Session, obj_in: schemas.PlaylistCreate
    ) -> models.Playlist:
        playlist = crud.create(db=db, obj_in=obj_in)

        message = {
            "program_code": playlist.program_code,
            "playlist_id": playlist.id,
        }
        message_crud.create(db=db, obj_in=message)

        return playlist

    def get_multi_playlists(
        self, db: Session, program_code: str, deployment_id: str
    ) -> List[models.Playlist]:
        return (
            db.query(self.model)
            .filter(
                self.model.program_code == program_code,
                self.model.deployment_id == deployment_id,
            )
            .all()
        )


crud = CRUDPlaylist(models.Playlist)
