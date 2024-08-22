class User:
    id = 0
    def __init__(self, name) -> None:
        self.user_id = User.id + 1
        self.name = name

