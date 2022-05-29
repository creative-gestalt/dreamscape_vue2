import json


def thing():
    new_list = []
    with open('C:\\Users\\thebb\\OneDrive\\mac-mini-db-backups\\dreams_2022-1-14.json', encoding='utf-8') as f:
        data = json.load(f)
        for dream in data:
            new_sub_list = []
            for subDream in dream['dreams']:
                data = subDream.split('|')
                time = ''
                if len(data) > 1:
                    time = data[1]
                new_sub_dream = {'subDream': data[0], 'time': time}
                new_sub_list.append(new_sub_dream)
            dream['dreams'] = new_sub_list
            new_list.append(dream)

    with open('C:\\Users\\thebb\\OneDrive\\mac-mini-db-backups\\dreams_modified.json', 'w', encoding='utf-8') as f:
        json.dump(new_list, f, ensure_ascii=False, indent=2)

    # print(new_list[659])


if __name__ == '__main__':
    thing()
