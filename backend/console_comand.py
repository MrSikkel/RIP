import typer
from rich.console import Console
from rich.table import Table

from backend import database, repository, schemas

app = typer.Typer()
console = Console()


#Вывод списка статей
def print_posts(posts):
    table = Table(title="Posts")

    table.add_column("ID", style="red")
    table.add_column("Author", style="white")
    table.add_column("Title", style="white")
    table.add_column("Text", style="white")

    for p in posts:
        table.add_row(str(p.id), p.author, p.title, p.text)

    console.print(table)


# ─────────────────────────────────────────────
# ЛОГИЧЕСКИЕ ФУНКЦИИ (используются меню)
# ─────────────────────────────────────────────

def list_posts_logic(skip=0, limit=10):
    db = database.SessionLocal()
    try:
        repo = repository.PostRepository(db)
        posts = repo.get_posts(skip=skip, limit=limit)

        if not posts:
            console.print("[yellow]База пуста[/yellow]")
            return

        print_posts(posts)

    finally:
        db.close()


def get_post_logic(post_id: int):
    db = database.SessionLocal()
    try:
        repo = repository.PostRepository(db)
        post = repo.get_post(post_id)

        if not post:
            console.print(f"[red]Статьи с id {post_id} не существует[/red]")
            return

        print_posts([post])
    finally:
        db.close()


def create_post_logic(title: str, author: str, text: str):
    db = database.SessionLocal()
    try:
        repo = repository.PostRepository(db)

        post_data = schemas.PostCreate(
            title=title,
            author=author,
            text=text
        )

        new_post = repo.create_post(post_data)

        console.print("[green]Статья успешно добавлена![/green]")
        print_posts([new_post])

    finally:
        db.close()


def edit_post_logic(post_id: int, title: str, author: str, text: str):
    db = database.SessionLocal()
    try:
        repo = repository.PostRepository(db)

        post_data = schemas.PostCreate(title=title, author=author, text=text)
        updated = repo.update_post(post_id, post_data)

        if not updated:
            console.print("[red]Статья не найдена[/red]")
            return

        console.print("[green]Статья изменена![/green]")
        print_posts([updated])

    finally:
        db.close()


def delete_post_logic(post_id: int):
    db = database.SessionLocal()
    try:
        repo = repository.PostRepository(db)
        deleted = repo.delete_post(post_id)

        if not deleted:
            console.print(f"[red]Поста с id {post_id} нет в базе[/red]")
            return

        console.print(f"[green]Статья {post_id} успешно удалена/green]")

    finally:
        db.close()


# ─────────────────────────────────────────────
# CLI КОМАНДЫ TYPER (обёртки)
# ─────────────────────────────────────────────

@app.command("list")
def list_posts(
    skip: int = typer.Option(0),
    limit: int = typer.Option(10),
):
    list_posts_logic(skip, limit)


@app.command("get")
def get_post(post_id: int):
    get_post_logic(post_id)


@app.command("create")
def create_post(
    title: str = typer.Option(...),
    author: str = typer.Option(...),
    text: str = typer.Option(...)
):
    create_post_logic(title, author, text)


@app.command("edit")
def edit_post(
    post_id: int,
    title: str = typer.Option(...),
    author: str = typer.Option(...),
    text: str = typer.Option(...)
):
    edit_post_logic(post_id, title, author, text)


@app.command("delete")
def delete_post(post_id: int):
    delete_post_logic(post_id)


# ─────────────────────────────────────────────
# МЕНЮ (ручной режим)
# ─────────────────────────────────────────────

def menu_loop():
    while True:
        console.print("\nВыберете действие:")
        console.print("1) Отобразить список статей")
        console.print("2) Выбрать статью (id)")
        console.print("3) Создать статью")
        console.print("4) Изменить статью")
        console.print("5) Удалить статью")
        console.print("0) Выход")

        choice = typer.prompt("Введите номер", default="0")

        if choice == "0":
            console.print("Bye")
            raise typer.Exit()

        elif choice == "1":
            list_posts_logic()

        elif choice == "2":
            pid = typer.prompt("Введите id статьи", default="")
            if pid.isdigit():
                get_post_logic(int(pid))
            else:
                console.print("[red]Неверный id[/red]")

        elif choice == "3":
            title = typer.prompt("Title*")
            author = typer.prompt("Author*")
            text = typer.prompt("Text")

            if not title.strip() or not author.strip():
                console.print("[red]Title и author обязательные поля[/red]")
                continue

            create_post_logic(title, author, text)

        elif choice == "4":
            pid = typer.prompt("Введите id", default="")
            if pid.isdigit():

                # Загружаем статью для подстановки значений
                db = database.SessionLocal()
                repo = repository.PostRepository(db)
                post = repo.get_post(int(pid))
                db.close()

                if not post:
                    console.print("[red]Статья не найдена[/red]")
                    continue

                # Подставляем текущие значения в prompt
                title = typer.prompt("Новый title", default=post.title)
                author = typer.prompt("Новый author", default=post.author)
                text = typer.prompt("Новый text", default=post.text)

                edit_post_logic(int(pid), title, author, text)

            else:
                console.print("[red]Неверный id[/red]")

        elif choice == "5":
            pid = typer.prompt("Введите id", default="")
            if pid.isdigit():
                delete_post_logic(int(pid))
            else:
                console.print("[red]Неверный id[/red]")

        else:
            console.print("[red]Неверный выбор[/red]")


# Точка входа ────────────────────────────────
if __name__ == "__main__":
    menu_loop()
