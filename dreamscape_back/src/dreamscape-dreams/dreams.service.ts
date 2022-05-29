import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dream } from './interfaces/dream.interface';
import { AddDreamDto } from './dto/add-dream.dto';

@Injectable()
export class DreamsService {
  constructor(
    @InjectModel('Dreams-Nick') private readonly nickModel: Model<Dream>,
    @InjectModel('Dreams-Lydia') private readonly lydiaModel: Model<Dream>,
  ) {}

  getModel(user): any {
    let model = Model;
    switch (user) {
      case 'nick':
        model = this.nickModel;
        break;
      case 'lydia':
        model = this.lydiaModel;
        break;
    }
    return model;
  }

  async getDreams(user, skip, limit): Promise<Dream[]> {
    return await this.getModel(user)
      .find()
      .sort({ date: 'desc' })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getAllDreams(user): Promise<Dream[]> {
    return await this.getModel(user).find().exec();
  }

  async getDream(user, dreamID): Promise<Dream> {
    return await this.getModel(user).findById(dreamID).exec();
  }

  async addDream(
    user,
    addDreamDto: AddDreamDto,
  ): Promise<HydratedDocument<Dream>[]> {
    return await this.getModel(user).insertMany(addDreamDto);
  }

  async deleteDreams(user, dreams): Promise<any> {
    return this.getModel(user).deleteMany({ _id: { $in: dreams } });
  }

  async updateDream(
    user,
    dreamID: string,
    addDreamDto: AddDreamDto,
  ): Promise<Dream> {
    return this.getModel(user).findByIdAndUpdate(dreamID, addDreamDto, {
      new: true,
    });
  }
}
